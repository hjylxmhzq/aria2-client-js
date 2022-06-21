import { EventEmitter } from 'events';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { v4 as uuidv4 } from 'uuid'
import { encode as encodeBase64 } from 'js-base64';
import { WebSocket, MessageEvent } from 'ws';
import { StatusKey } from './defines';

export type EventName = 'downloadStart';
export type TransportType = 'get' | 'post' | 'websocket';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
type PartialRequired<T, K extends keyof T> = Required<Pick<T, K>> & Partial<Omit<T, K>>;

export interface Aria2Options {
    token: string;
    transportType: TransportType;
    url: string;
}

type OptionalKey = 'transportType';

type Aria2ConstructorOptions = Optional<Aria2Options, OptionalKey>;

const defaultOptions: PartialRequired<Aria2Options, OptionalKey> = {
    transportType: 'post',
}

const httpAgent = axios.create();

export default class Aria2 extends EventEmitter {
    public options: Aria2Options;
    public ax: AxiosInstance;
    private _ws?: WebSocket;
    private wsMessageListeners: { id: string, listener: (ev: MessageEvent) => void }[] = [];
    constructor(_options: Aria2ConstructorOptions) {
        super();
        this.options = Object.assign({}, defaultOptions, _options);
        this.ax = httpAgent;
    }

    destroy() {
        if (this._ws) {
            this._ws.removeEventListener('message', this._wsEventListener);
            this._ws.close();
        }
    }

    private _wsEventListener = (ev: MessageEvent) => {
        const jsonData = JSON.parse(ev.data.toString());
        const notUsed: typeof this.wsMessageListeners = [];
        for (const listener of this.wsMessageListeners) {
            if (listener.id === jsonData.id) {
                listener.listener(jsonData);
            } else {
                notUsed.push(listener);
            }
        }
        this.wsMessageListeners = notUsed;
    }

    private get ws(): Promise<WebSocket> {
        if (!this._ws) {
            this._ws = new WebSocket(this.options.url);
            this._ws.addEventListener('message', this._wsEventListener);
        }
        return new Promise((resolve, reject) => {
            if (this._ws!.readyState === WebSocket.OPEN) {
                resolve(this._ws as WebSocket);
            } else {
                this._ws!.addEventListener('open', () => {
                    resolve(this._ws as WebSocket);
                }, { once: true });
            }
        });
    }

    private onWSMessage(id: string, fn: (msg: any) => void) {
        this.wsMessageListeners.push({ listener: fn, id });
    }

    private uid() {
        return uuidv4();
    }

    private async callByGet(method: string, params: any[]) {
        const search = new URLSearchParams();

        const allParams = [`token:${this.options.token}`, ...params];
        search.append('method', method);
        search.append('id', this.uid());
        search.append('jsonrpc', '2.0');
        search.append('params', encodeBase64(JSON.stringify(allParams)));

        const queryString = this.options.url + '?' + search.toString();
        const resp = await this.ax.get(queryString);
        const result = resp.data.result;
        return result;
    }

    private async callByPost(method: string, params: any[]) {
        const resp = await this.ax.post(this.options.url, {
            id: this.uid(),
            jsonrpc: "2.0",
            method,
            params: [`token:${this.options.token}`, ...params],
        });
        const result = resp.data.result;
        return result;
    }

    private async callByWS(method: string, params: any[]) {
        const ws = await this.ws;
        const uid = this.uid();
        ws.send(JSON.stringify({
            id: uid,
            jsonrpc: "2.0",
            method,
            params: [`token:${this.options.token}`, ...params],
        }));

        return new Promise((resolve, reject) => {
            this.onWSMessage(uid, (data) => {
                console.log(this.wsMessageListeners)
                resolve(data.result);
            });
        });
    }

    async call(method: string, params: any[] = []) {
        if (this.options.transportType === 'get') {
            return await this.callByGet(method, params);
        } else if (this.options.transportType === 'post') {
            return await this.callByPost(method, params);
        } else if (this.options.transportType === 'websocket') {
            return await this.callByWS(method, params);
        } else {
            throw new Error(`unvalid transport type: ${this.options.transportType}`);
        }
    }

    async addURI(uris: string[], dest: string) {
        const result = await this.call('aria2.addUri', [uris, { dir: dest }]);
        return result;
    }

    async remove(gid: string) {
        const result = await this.call('aria2.remove', [gid]);
        return result;
    }

    async forceRemove(gid: string) {
        const result = await this.call('aria2.forceRemove', [gid]);
        return result;
    }

    async pause(gid: string) {
        const result = await this.call('aria2.pause', [gid]);
        return result;
    }

    async pauseAll() {
        const result = await this.call('aria2.pauseAll');
        return result;
    }

    async forcePause(gid: string) {
        const result = await this.call('aria2.forcePause', [gid]);
        return result;
    }

    async forcePauseAll(gid: string) {
        const result = await this.call('aria2.forcePauseAll');
        return result;
    }

    async tellStatus(gid: string, keys: StatusKey[] = []) {
        const result = await this.call('aria2.tellStatus', [gid, keys]);
        return result;
    }

    async getUris(gid: string) {
        const result = await this.call('aria2.getUris', [gid]);
        return result;
    }

    async getFiles(gid: string) {
        const result = await this.call('aria2.getFiles', [gid]);
        return result;
    }

    async getVersion() {
        const result = await this.call('aria2.getVersion');
        return result;
    }

    async getGlobalOption() {
        const result = await this.call('aria2.getGlobalOption');
        return result;
    }

    on(eventName: 'downloadStart', listener: (file: string) => void): this;
    on(eventName: EventName, listener: (...args: any[]) => void) {


        return this;
    }
}

export {
    Aria2,
};