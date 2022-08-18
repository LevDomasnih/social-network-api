import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ChangeLikeScheme {
    @Field()
    text: string;
}
