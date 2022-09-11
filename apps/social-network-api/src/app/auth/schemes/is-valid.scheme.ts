import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class IsValidScheme {
    @Field()
    valid: boolean
}
