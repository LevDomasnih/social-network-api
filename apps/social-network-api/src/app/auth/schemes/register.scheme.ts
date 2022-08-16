import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RegisterScheme {
    @Field()
    access_token: string
}
