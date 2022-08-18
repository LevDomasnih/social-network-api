import { Field, InputType } from '@nestjs/graphql';
import { IsDateString, IsOptional, IsString } from 'class-validator';

@InputType()
export class EditProfileInput {

    @Field()
    @IsString()
    middleName: string;

    @Field()
    @IsString()
    firstName: string;

    @Field()
    @IsString()
    lastName: string;

    @Field()
    @IsString()
    phone: string;

    @Field()
    @IsString()
    email: string;

    @Field()
    @IsString()
    login: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    birthday?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    country?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    city?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    relatives?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    school?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    status?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    about?: string;

    @Field(type => Date)
    @IsDateString()
    createdAt: Date;

    @Field(type => Date)
    @IsDateString()
    updatedAt: Date;
}
