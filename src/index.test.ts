import Aria2 from ".";

const aria2UsePost = new Aria2({
    url: 'http://127.0.0.1:6800/jsonrpc', // your aria2 api url and token
    token: '12345678',
    transportType: 'post',
});
const aria2UseGet = new Aria2({
    url: 'http://127.0.0.1:6800/jsonrpc', // your aria2 api url and token
    token: '12345678',
    transportType: 'get',
});
const aria2UseWS = new Aria2({
    url: 'ws://127.0.0.1:6800/jsonrpc', // your aria2 api url and token
    token: '12345678',
    transportType: 'websocket',
});

for (let [aria2Type, aria2] of [['GET', aria2UseGet], ['POST', aria2UsePost], ['WS', aria2UseWS]] as [string, Aria2][]) {

    test(`getGlobalOption:${aria2Type}`, async () => {
        const globalOptions = await aria2.getGlobalOption();
        expect(typeof globalOptions === 'object').toBeTruthy();
        const allKeys = new Set(Object.keys(globalOptions));
        expect(globalOptionKeys.every(k => allKeys.has(k))).toBeTruthy();
    });

    test(`addURI:${aria2Type}`, async () => {
        const gid = await aria2.addURI(['http://www.baidu.com'], '/downloads/a');
        expect(typeof gid).toBe('string');
    });

    test(`getUris:${aria2Type}`, async () => {
        const gid = await aria2.addURI(['http://www.baidu.com'], '/downloads/a');
        const uris = await aria2.getUris(gid);
        expect(Array.isArray(uris) && !!uris.length).toBeTruthy();
        expect('status' in uris[0]).toBeTruthy();
        expect('uri' in uris[0]).toBeTruthy();
    });

    

    aria2.destroy();
}

const globalOptionKeys = ["allow-overwrite", "allow-piece-length-change", "always-resume", "async-dns", "auto-file-renaming", "auto-save-interval", "bt-detach-seed-only", "bt-enable-hook-after-hash-check", "bt-enable-lpd", "bt-force-encryption", "bt-hash-check-seed", "bt-load-saved-metadata", "bt-max-open-files", "bt-max-peers", "bt-metadata-only", "bt-min-crypto-level", "bt-prioritize-piece", "bt-remove-unselected-file", "bt-request-peer-speed-limit", "bt-require-crypto", "bt-save-metadata", "bt-seed-unverified", "bt-stop-timeout", "bt-tracker", "bt-tracker-connect-timeout", "bt-tracker-interval", "bt-tracker-timeout", "ca-certificate", "check-certificate", "check-integrity", "conditional-get", "conf-path", "connect-timeout", "console-log-level", "content-disposition-default-utf8", "continue", "daemon", "deferred-input", "dht-entry-point", "dht-entry-point6", "dht-file-path", "dht-file-path6", "dht-listen-port", "dht-message-timeout", "dir", "disable-ipv6", "disk-cache", "download-result", "dry-run", "dscp", "enable-color", "enable-dht", "enable-dht6", "enable-http-keep-alive", "enable-http-pipelining", "enable-mmap", "enable-peer-exchange", "enable-rpc", "event-poll", "file-allocation", "follow-metalink", "follow-torrent", "force-save", "ftp-pasv", "ftp-reuse-connection", "ftp-type", "hash-check-only", "help", "http-accept-gzip", "http-auth-challenge", "http-no-cache", "http-want-digest", "human-readable", "keep-unfinished-download-result", "listen-port", "log-level", "lowest-speed-limit", "max-concurrent-downloads", "max-connection-per-server", "max-download-limit", "max-download-result", "max-file-not-found", "max-mmap-limit", "max-overall-download-limit", "max-overall-upload-limit", "max-resume-failure-tries", "max-tries", "max-upload-limit", "metalink-enable-unique-protocol", "metalink-preferred-protocol", "min-split-size", "min-tls-version", "netrc-path", "no-conf", "no-file-allocation-limit", "no-netrc", "on-download-complete", "on-download-stop", "optimize-concurrent-downloads", "parameterized-uri", "pause-metadata", "peer-agent", "peer-id-prefix", "piece-length", "proxy-method", "quiet", "realtime-chunk-checksum", "remote-time", "remove-control-file", "retry-on-400", "retry-on-403", "retry-on-406", "retry-on-unknown", "retry-wait", "reuse-uri", "rlimit-nofile", "rpc-allow-origin-all", "rpc-listen-all", "rpc-listen-port", "rpc-max-request-size", "rpc-save-upload-metadata", "rpc-secure", "save-not-found", "save-session", "save-session-interval", "seed-ratio", "seed-time", "server-stat-timeout", "show-console-readout", "show-files", "socket-recv-buffer-size", "split", "stderr", "stop", "stream-piece-selector", "summary-interval", "timeout", "truncate-console-readout", "uri-selector", "use-head", "user-agent"];