import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class IsValidDto {

    @Field()
    fieldName: string;

    @Field()
    fieldValue: string;
}
