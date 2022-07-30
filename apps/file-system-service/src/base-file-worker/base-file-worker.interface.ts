import { FolderName, UserEntity } from '@app/nest-postgre';
import { UpdateProfileFileContract } from '@app/amqp-contracts';
import { UpdateProfileRequestDto } from '../update-profile/dto/update-profile.request.dto';

export interface ISaveFileRequest extends UpdateProfileRequestDto {
}

export interface ISaveFileResponse extends UpdateProfileFileContract.ResponsePayload{
}

export interface IMakeDirRequest {
    user: UserEntity,
    fileMethod: string,
    folder: FolderName,
}

export interface IMakeDirResponse {
    fileName: string;
    filePath: string;
}

export interface BaseFileWorkerInterface {
    saveFile(args: ISaveFileRequest): Promise<ISaveFileResponse>;
}
