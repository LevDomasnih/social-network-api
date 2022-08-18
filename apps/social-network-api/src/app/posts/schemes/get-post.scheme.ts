import { Field, ObjectType } from '@nestjs/graphql';
import { FilesEntity, UserEntity } from '@app/nest-postgre';

@ObjectType()
export class GetPostScheme {
    // @Field()
    // owner: UserEntity;
    //
    // @Field(type => FilesEntity)
    // images: FilesEntity;
    //
    // @Field()
    // files: FilesEntity;

    @Field(type => [String])
    likes: string[]

    @Field(type => [String])
    views: string[];

    @Field(type => String)
    text: string
}
