import { IsString } from 'class-validator';

export class CreatePostDto {

    @IsString()
    ownerId: string

    @IsString()
    text: string
}