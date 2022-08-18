import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
class GetPostsSchemeProfile {
    @Field(type => String, {nullable: true})
    avatar: string | null;

    @Field()
    firstName: string;

    @Field()
    lastName: string;
}

@ObjectType()
export class GetPostsScheme {
    @Field(type => ID)
    id: string;

    @Field(type => Date)
    createdAt: Date;

    @Field(type => Date)
    updatedAt: Date;

    @Field(type => Int)
    likes: number;

    @Field()
    isLiked: boolean;

    @Field(type => Int)
    views: number;

    @Field()
    text: string;

    @Field(type => GetPostsSchemeProfile)
    profile: GetPostsSchemeProfile
}
