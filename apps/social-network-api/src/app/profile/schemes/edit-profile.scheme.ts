import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class EditProfileScheme {
    @Field(type => Boolean)
    updated: boolean
}
