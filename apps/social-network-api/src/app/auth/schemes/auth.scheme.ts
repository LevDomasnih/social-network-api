import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthScheme {

    @Field(type => ID)
    id: string;

    @Field()
    login: string;

    @Field()
    email: string;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field(type => String, {nullable: true})
    avatar: string | null;

    @Field(type => Int)
    notifications: number;
}
