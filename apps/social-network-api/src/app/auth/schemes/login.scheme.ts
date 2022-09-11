import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoginScheme {
    @Field()
    access_token: string
}
