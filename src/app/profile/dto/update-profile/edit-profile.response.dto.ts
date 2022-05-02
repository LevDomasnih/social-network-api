import { ApiProperty } from '@nestjs/swagger';

export class EditProfileResponseDto {
    @ApiProperty({
        description: 'профиль обновлен',
        example: true
    })
    updated: boolean
}
