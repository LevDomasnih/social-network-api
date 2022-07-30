import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOwnersRequestDto {

    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    @IsString()
    dialogId: string;

    @ApiProperty({ type: ['string'] })
    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(1, {
        message: 'Чат не может состоять из одного пользователя',
    })
    owners: string[];
}
