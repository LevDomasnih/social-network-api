import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreatePostScheme {
    @Field()
    text: string;
}
