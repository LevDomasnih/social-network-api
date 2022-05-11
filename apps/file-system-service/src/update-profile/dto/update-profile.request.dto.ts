import { FolderName, UserEntity } from '@app/nest-postgre';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateProfileFileContract } from '@app/amqp-contracts';

export class UpdateProfileRequestDto implements UpdateProfileFileContract.RequestPayload {
    @ValidateNested()
    @Type(() => Buffer)
    buffer: Buffer;

    @IsString()
    fileField: string;

    @IsEnum(FolderName)
    @IsOptional()
    folder?: FolderName;

    @IsString()
    oldPath: string;

    @ValidateNested()
    @Type(() => UserEntity)
    user: UserEntity;
}
