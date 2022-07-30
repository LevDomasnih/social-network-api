import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class Profile {
    @ApiProperty()
    @IsString()
    avatar: string | null;
    @ApiProperty()
    @IsString()
    firstName: string;
    @ApiProperty()
    @IsString()
    lastName: string;
}

export class GetPostsDto {
    @ApiProperty()
    @IsString()
    id: string;
    @ApiProperty()
    profile: Profile;
    @ApiProperty()
    @IsString()
    text: string;
    @ApiProperty()
    @IsString()
    createdAt: Date;
    @ApiProperty()
    @IsString()
    updatedAt: Date;
    @ApiProperty()
    @IsNumber()
    likes: number;
    @ApiProperty()
    @IsNumber()
    views: number;
    @ApiProperty()
    @IsBoolean()
    isLiked: boolean;
}

