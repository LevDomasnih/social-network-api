import { ArgsType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ArgsType()
export class LoginDto {

    @IsString()
    @Field()
    loginOrEmail: string;

    @IsString()
    @Field()
    password: string;
}
