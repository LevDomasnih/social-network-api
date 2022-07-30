import { ApiProperty } from '@nestjs/swagger';

export class EditAvatarResponse {
    @ApiProperty({
        description: 'Название файла',
        example: '4b890a22-705b-4872-acb6-a8b829ee0e41_avatar_1651603183'
    })
    fileName: string
}
