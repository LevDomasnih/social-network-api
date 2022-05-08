import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdatePostRequestDto {
    @ApiProperty({
        description: 'Текст поста',
        example: 'Hello!',
    })
    @IsString()
    text: string;
}
