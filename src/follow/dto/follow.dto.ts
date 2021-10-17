import { IsString } from 'class-validator';

export class FollowDto {

    @IsString()
    followUserId: string

    @IsString()
    userId: string
}