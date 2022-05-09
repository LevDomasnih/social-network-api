import { Status, UserEntity } from '@app/nest-postgre';

export interface ISaveFileRequest {
    buffer: Buffer;
    user: UserEntity;
    fileField: string;
    oldPath?: string;
    folder?: string;
}

export interface ISaveFileResponse {
    path: string;
    name: string;
    status: Status;
    lastProlong: Date;
    mime: string;
    size: number;
}

export interface IMakeDirRequest {
    user: UserEntity,
    fileMethod: string,
    folder: string,
}

export interface IMakeDirResponse {
    fileName: string;
    filePath: string;
}

export interface BaseFileWorkerInterface {
    saveFile(args: ISaveFileRequest): Promise<ISaveFileResponse>;
}
