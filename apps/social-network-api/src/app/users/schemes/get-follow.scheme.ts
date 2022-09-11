import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetFollowScheme {
    @Field(type => ID)
    id: string;

    @Field()
    email: string;

    @Field()
    login: string;
}
