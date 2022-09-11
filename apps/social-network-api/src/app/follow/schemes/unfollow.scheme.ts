import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UnfollowScheme {
    @Field()
    deleted: boolean
}
