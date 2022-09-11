import { Field, ID, ObjectType } from '@nestjs/graphql';
import { FilesEntity } from '@app/nest-postgre';

@ObjectType()
export class DialogInfoSchema {
    @Field(type => ID)
    id: string

    @Field(type => FilesEntity, {nullable: true})
    image: FilesEntity

    @Field()
    name: string
}
