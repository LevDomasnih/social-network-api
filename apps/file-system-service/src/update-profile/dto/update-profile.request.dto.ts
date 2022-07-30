import { FolderName, Status, UserEntity } from '@app/nest-postgre';
import { IsDate, IsDateString, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { UpdateProfileFileContract } from '@app/amqp-contracts';

export class UpdateProfileRequestDto implements UpdateProfileFileContract.RequestPayload {

    constructor(data: UpdateProfileRequestDto) {
        Object.assign(this, data);
    }

    @ValidateNested()
    @Type(() => Buffer)
    readonly buffer: Buffer;

    @IsString()
    readonly fileField: string;

    @IsEnum(FolderName)
    @IsOptional()
    readonly folder: FolderName;

    @IsEnum(Status)
    @IsOptional()
    readonly status: Status;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    @Transform(({value}) => new Date(value))
    readonly lastProlong: Date

    @IsOptional()
    @IsString()
    readonly oldPath?: string;

    @ValidateNested()
    @Type(() => UserEntity)
    readonly user: UserEntity;
}
