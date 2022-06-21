export enum StatusKey {
    'gid' = 'gid',
    'status' = 'status',
    'totalLength' = 'totalLength',
    'completedLength' = 'completedLength',
    'uploadLength' = 'uploadLength',
    'bitfield' = 'bitfield',
    'downloadSpeed' = 'downloadSpeed',
    'uploadSpeed' = 'uploadSpeed',
    'infoHash' = 'infoHash',
    'numSeeders' = 'numSeeders',
    'seeder' = 'seeder',
    'pieceLength' = 'pieceLength',
    'numPieces' = 'numPieces',
    'connections' = 'connections',
    'errorCode' = 'errorCode',
    'errorMessage' = 'errorMessage',
    'followedBy' = 'followedBy',
    'following' = 'following',
    'belongsTo' = 'belongsTo',
    'dir' = 'dir',
    'files' = 'files',
    'bittorrent' = 'bittorrent',
    'verifiedLength' = 'verifiedLength',
    'verifyIntegrityPending' = 'verifyIntegrityPending'
};

export interface UriInfo {
    uri: string;
    status: 'used' | 'waiting';
};

export interface FileInfo {
    uris: UriInfo[];
    index: string;
    path: string;
    length: string;
    completedLength: string;
    selected: 'true' | 'false';
}