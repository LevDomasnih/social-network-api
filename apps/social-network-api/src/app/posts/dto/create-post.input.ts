import { IsOptional, IsString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
    @Field()
    @IsString()
    text: string;

    @Field({nullable: true})
    @IsString()
    @IsOptional()
    parentPost: string;
}
