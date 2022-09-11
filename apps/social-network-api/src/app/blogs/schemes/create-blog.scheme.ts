import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateBlogSchemeProfile {
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
export class CreateBlogScheme {
    @Field(type => ID)
    id: string;

    // @Field(type => JSON)
    entityMap: Record<string, any>;

    @Field(type => Int)
    likes: number;

    @Field(type => Int)
    views: number;

    @Field(type => [CreateBlogSchemeTextBlock])
    text: CreateBlogSchemeTextBlock[];

    @Field(type => String, { nullable: true })
    mainImage: string | null;

    // @Field()
    comments: unknown[];

    @Field(type => CreateBlogSchemeProfile)
    profile: CreateBlogSchemeProfile;

    @Field(type => Date)
    createdAt: Date;

    @Field(type => Date)
    updatedAt: Date;
}


@ObjectType()
export class CreateBlogSchemeTextBlock {
    @Field(type => ID)
    id: string;

    @Field(type => Date)
    createdAt: Date;

    @Field(type => Date)
    updatedAt: Date;

    // @Field(type => JSON)
    data: Record<string, any>;

    @Field(type => Int)
    depth: number;

    // @Field(type => JSON)
    entityRanges: any[];

    @Field(type => CreateBlogSchemeInlineStyleRanges, { nullable: true })
    inlineStyleRanges: CreateBlogSchemeInlineStyleRanges[];

    @Field()
    key: string;

    @Field()
    text: string;

    @Field()
    type: string;
}

@ObjectType()
export class CreateBlogSchemeInlineStyleRanges {
    @Field()
    style: string;

    @Field()
    length: number;

    @Field()
    offset: number;
}
