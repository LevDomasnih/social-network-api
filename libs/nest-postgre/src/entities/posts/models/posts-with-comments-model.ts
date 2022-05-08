import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID, ValidateIf, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PostsWithCommentsModel {
    @ApiProperty({
        description: 'id поста',
        example: 'd5532bd6-24da-49c3-8e0c-f996f28b7f49',
    })
    @IsString()
    @IsUUID()
    id: string;
    @ApiProperty({
        description: 'текст поста',
        example: 'Всем привет!',
    })
    @IsString()
    text: string;
    @ApiProperty({
        description: 'ссылка на файл',
        example: '../file/name',
    })
    @IsString()
    image: string;
    @ApiProperty({
        description: 'количество лайков',
        example: 4,
    })
    @IsNumber()
    likes: 0;
    @ApiProperty({
        description: 'количество просмотров',
        example: 20,
    })
    @IsNumber()
    views: 0;
    @ApiProperty({
        description: 'id владельца поста',
        example: 'e8c4986b-1b5f-47c9-a533-d22329df0da7',
    })
    @IsUUID()
    @IsString()
    ownerId: string;
    @ApiProperty({
        description: 'комментарии под постом',
        type: [PostsWithCommentsModel],
    })
    @ValidateNested({ each: true })
    @Type(() => PostsWithCommentsModel)
    comments: PostsWithCommentsModel[];
    @ApiProperty({
        description: 'под каким постом оставлен данный пост',
        example: '859d0610-86bd-4733-b954-ab5a491f8e56',
    })
    @IsUUID()
    @IsString()
    @ValidateIf((object, value) => value !== null)
    parentPostsId: string | null;
}
