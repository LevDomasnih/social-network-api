import { ApiProperty } from '@nestjs/swagger';

export class UpdateBlogResponseDto {
    @ApiProperty({
        description: 'пост обновлен',
        example: true
    })
    updated: boolean
}
