import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BlogsOfUserSchemeProfile {
    @Field(type => String, { nullable: true })
    avatar: string | null;

    @Field(type => String, { nullable: true })
    firstName: string | null;

    @Field(type => String, { nullable: true })
    lastName: string | null;

    @Field(type => String, { nullable: true })
    middleName: string | null;
}

@ObjectType()
export class BlogsOfUserScheme {
    @Field(type => ID)
    id: string;

    // @Field(type => JSON)
    entityMap: Record<string, any>;

    @Field(type => Int)
    likes: number;

    @Field(type => Int)
    views: number;

    @Field(type => Boolean)
    isLiked: boolean;

    @Field(type => [BlogsOfUserSchemeTextBlock])
    text: BlogsOfUserSchemeTextBlock[];

    @Field(type => String, { nullable: true })
    mainImage: string | null;

    // @Field()
    comments: unknown[];

    @Field(type => BlogsOfUserSchemeProfile)
    profile: BlogsOfUserSchemeProfile;

    @Field()
    createdAt: string;

    @Field()
    updatedAt: string;
}

@ObjectType()
export class BlogsOfUserSchemeTextBlock {
    @Field(type => ID)
    id: string;

    @Field()
    createdAt: string;

    @Field()
    updatedAt: string;

    // @Field(type => JSON)
    data: Record<string, any>;

    @Field(type => Int)
    depth: number;

    // @Field(type => JSON)
    entityRanges: any[];

    @Field(type => BlogsOfUserSchemeInlineStyleRanges, { nullable: true })
    inlineStyleRanges: BlogsOfUserSchemeInlineStyleRanges[];

    @Field()
    key: string;

    @Field()
    text: string;

    @Field()
    type: string;
}

@ObjectType()
export class BlogsOfUserSchemeInlineStyleRanges {
    @Field()
    style: string;

    @Field()
    length: number;

    @Field()
    offset: number;
}
