import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostResponseDto {
    @ApiProperty({
        description: 'пост обновлен',
        example: true
    })
    updated: boolean
}
