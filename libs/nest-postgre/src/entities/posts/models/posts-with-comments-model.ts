import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PostTextBlocksEntity } from '@app/nest-postgre/entities';

class PostsProfile {
    @ApiProperty({
        description: 'ссылка на фото пользователя',
        example: '../file/name',
    })
    @IsString()
    avatar: string | null;
    @ApiProperty({
        description: 'Имя',
        example: 'Иван',
    })
    @IsString()
    firstName: string | null;
    @ApiProperty({
        description: 'Фамилия',
        example: 'Иванов',
    })
    @IsString()
    lastName: string | null;
    @ApiProperty({
        description: 'Имя',
        example: 'Иванович',
    })
    @IsString()
    middleName: string | null;
}

export class PostsWithCommentsModel {
    @ApiProperty({
        description: 'id поста',
        example: 'd5532bd6-24da-49c3-8e0c-f996f28b7f49',
    })
    @IsString()
    @IsUUID()
    id: string;
    @ApiProperty({ type: Date })
    @IsDateString()
    createdAt: Date;
    @ApiProperty({ type: Date })
    @IsDateString()
    updatedAt: Date;
    @ApiProperty({})
    entityMap: Record<string, unknown>;
    @IsNumber()
    @ApiProperty({
        description: 'количество лайков',
        example: 20,
    })
    likes: number;
    @ApiProperty({
        description: 'количество просмотров',
        example: 20,
    })
    @IsNumber()
    views: number;
    @ValidateNested({ each: true })
    @Type(() => PostTextBlocksEntity)
    textBlocks: PostTextBlocksEntity[];
    @ApiProperty({
        description: 'ссылка на основное фото',
        example: '../file/name',
    })
    @IsString()
    mainImage: string | null;
    comments: unknown[];
    @ValidateNested({ each: true })
    @Type(() => PostsProfile)
    profile: PostsProfile;
}
