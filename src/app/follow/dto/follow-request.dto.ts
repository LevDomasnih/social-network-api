import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FollowRequestDto {
    @ApiProperty()
    @IsString()
    user: string
}
