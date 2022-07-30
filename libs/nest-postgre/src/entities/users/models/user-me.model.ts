import { ApiProperty } from '@nestjs/swagger';
import { ProfileEntity } from '@app/nest-postgre/entities';

export class UserMeModel {
    @ApiProperty({
        description: 'id пользователя',
        example: '1b5b029-8bb8-4076-83d8-4f29a58e4dca',
    })
    id: string;
    @ApiProperty({
        description: 'email пользователя',
        example: 'lev@mail.ru',
    })
    email: string;
    @ApiProperty({
        description: 'логин пользователя',
        example: 'levnew',
    })
    login: string;
    @ApiProperty({
        description: 'профиль пользователя',
    })
    profile: ProfileEntity;
}
