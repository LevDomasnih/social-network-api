import { ISaveFileRequest } from '../../base-file-worker/base-file-worker.interface';
import { UserEntity } from '@app/nest-postgre';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProfileRequestDto implements ISaveFileRequest {
    @ValidateNested()
    @Type(() => Buffer)
    buffer: Buffer;

    @IsString()
    fileField: string;

    @IsString()
    @IsOptional()
    folder?: string;

    @IsString()
    oldPath: string;

    @ValidateNested()
    @Type(() => UserEntity)
    user: UserEntity;
}
