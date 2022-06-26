# aria2-client-js
A simple JavaScript/TypeScript aria2 client lib which supports aria2 http/websocket api

# tutorial

## yarn/npm

```bash
npm install -S aria2-client
```

```bash
yarn add aria2-client-js
```

# Examples

```javascript

const aria2 = new Aria2({
    url: 'http://127.0.0.1:6800/jsonrpc', // your json rpc here
    token: 'your token here',
    transportType: 'post', // or 'get' | 'websocket', default is 'post'
});

// Add a new download
const gid = await aria2.addURI(['http://a.com/path/to/file'], '/downloads');

// Delete a download task
const deletedGid = await aria2.remove(gid);

// Get download status
const status = await aria2.tellStatus(gid);

// Get global settings of aria2 backend
const globalOptions = await aria2.getGlobalOption();

// Get uris of a download task
const uris = await aria2.getUris(gid);

// Get all files of a download task
const files = await aria2.getFiles(gid);

...

```

For more information please check official tutorial: Official Tutorial:
https://aria2.github.io/manual/en/html/aria2c.html#rpc-interface
