import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType('register')
export class RegisterDto {
    @IsString()
    @Field(type => String)
    firstName: string;

    @IsString()
    @Field(type => String)
    lastName: string;

    @IsString()
    @Field(type => String)
    phone: string;

    @IsString()
    @Field(type => String)
    email: string;

    @IsString()
    @Field(type => String)
    password: string;
}
