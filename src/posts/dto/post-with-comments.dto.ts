import { IsNumber, IsString, IsUUID, ValidateIf, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PostWithCommentsDto {
    @ApiProperty({ description: 'id поста', example: 'd5532bd6-24da-49c3-8e0c-f996f28b7f49' })
    @IsString()
    @IsUUID()
    id: string;
    @ApiProperty({ description: 'текст сообщения', example: 'hello!!' })
    @IsString()
    text: string;
    @ApiProperty({ description: 'путь к файлу', example: 'file1' })
    @IsString()
    image: string;
    @ApiProperty({ description: 'кол-во лайков', example: 4 })
    @IsNumber()
    likes: 0;
    @ApiProperty({ description: 'кол-во просмотров', example: 5 })
    @IsNumber()
    views: 0;
    @ApiProperty({ description: 'id владельца', example: 'e8c4986b-1b5f-47c9-a533-d22329df0da7' })
    @IsUUID()
    @IsString()
    ownerId: string;
    @ApiProperty({ description: 'комментарии к посту' })
    @ValidateNested({ each: true })
    @Type(() => PostWithCommentsDto)
    comments: PostWithCommentsDto[];
    @ApiProperty({ description: 'id родительского поста', example: '859d0610-86bd-4733-b954-ab5a491f8e56' })
    @IsString()
    @IsUUID()
    @ValidateIf((object, value) => value !== null)
    parentPostsId: string | null;
}
