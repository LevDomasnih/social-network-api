import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class EditImageScheme {
    @Field()
    fileName: string
}
