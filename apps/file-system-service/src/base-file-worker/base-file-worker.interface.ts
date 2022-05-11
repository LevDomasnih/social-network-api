import { UserEntity } from '@app/nest-postgre';
import { UpdateProfileFileContract } from '@app/amqp-contracts';

export interface ISaveFileRequest extends UpdateProfileFileContract.RequestPayload {
}

export interface ISaveFileResponse extends UpdateProfileFileContract.ResponsePayload{
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
