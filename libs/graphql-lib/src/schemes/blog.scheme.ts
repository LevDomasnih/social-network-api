import { BlogEntity } from '@app/nest-postgre';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { UserScheme } from '@app/graphql-lib/schemes/user.scheme';

@ObjectType()
export class BlogScheme implements BlogEntity {
    @Field(type => ID)
    id: string;
    // @Field(type => JSON)
    // entityMap: {};
    @Field(type => [String])
    headers: string[];
    @Field()
    likes: number;
    // @Field()
    // mainImage: FilesEntity;
    @Field(type => UserScheme)
        // @ts-ignore
    owner: UserScheme;
    @Field(type => Int)
    views: number;
    @Field(type => Date)
    updatedAt: Date;
    @Field(type => Date)
    createdAt: Date;
}
