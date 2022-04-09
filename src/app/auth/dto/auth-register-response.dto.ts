import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthRegisterResponseDto {

  @IsString()
  @ApiProperty()
  access_token: string
}