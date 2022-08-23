import { UserEntity } from '@app/nest-postgre';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { BlogScheme } from '@app/graphql-lib/schemes/blog.scheme';

@ObjectType()
export class UserScheme /*implements Omit<UserEntity, 'passwordHash'>*/ {
    @Field(type => ID)
    id: string;
    @Field(type => [BlogScheme])
    blogs: [BlogScheme];
    /*@Field()
    dialogs: [];
    @Field()
    follow: any;
    @Field()
    messages: [];
    @Field()
    profile: any;*/
    @Field()
    email: string;
    @Field()
    login: string;
    @Field(type => Date)
    updatedAt: Date;
    @Field(type => Date)
    createdAt: Date;
}
