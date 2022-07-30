import { ApiProperty } from '@nestjs/swagger';

export class UnfollowResponseDto {
    @ApiProperty({
        description: 'подписка отменена',
        example: true
    })
    deleted: boolean
}
