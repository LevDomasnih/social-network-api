import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
class GetDialogSchemeMessages {
    @Field(type => ID)
    id: string;

    @Field()
    text: string;

    @Field(type => ID)
    ownerId: string;

    @Field(type => Date)
    createdAt: Date;

    @Field(type => Date)
    updatedAt: Date;
}

@ObjectType()
class GetDialogSchemeInfo {
    @Field(type => ID)
    id: string;

    @Field(type => String, {nullable: true})
    image: string | null;

    @Field()
    name: string;
}

@ObjectType()
class GetDialogSchemeUser {
    @Field(type => ID)
    id: string;

    @Field(type => String, {nullable: true})
    avatar: string | null;

    @Field()
    firstName: string;

    @Field()
    lastName: string;
}

@ObjectType()
export class GetDialogScheme {
    @Field(type => ID, {nullable: true})
    id: string | null;

    @Field(type => [GetDialogSchemeMessages])
    messages: GetDialogSchemeMessages[];

    @Field()
    status: string;

    @Field(type => GetDialogSchemeInfo)
    info: GetDialogSchemeInfo;

    @Field(type => [GetDialogSchemeUser])
    users: GetDialogSchemeUser[]
}
