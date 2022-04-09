import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileResponseDto {
    @ApiProperty({
        description: 'профиль обновлен',
        example: true
    })
    updated: boolean
}
