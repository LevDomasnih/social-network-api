import { Field, InputType } from '@nestjs/graphql';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UpdateDialogOwnersInput {

    @IsNotEmpty()
    @IsString()
    @Field()
    dialogId: string;

    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(1, {
        message: 'Чат не может состоять из одного пользователя',
    })
    @Field(type => [String])
    owners: string[];
}
