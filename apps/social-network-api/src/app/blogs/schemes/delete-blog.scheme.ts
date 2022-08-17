import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeleteBlogScheme {

    @Field()
    deleted: boolean
}
