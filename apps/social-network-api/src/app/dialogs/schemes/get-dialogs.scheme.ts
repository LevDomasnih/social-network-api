import { Field, ID, ObjectType } from '@nestjs/graphql';
import { DialogType } from '@app/nest-postgre';

@ObjectType()
class GetDialogsSchemeLastMessages {
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
class GetDialogsSchemeInfo {
    @Field(type => ID)
    id: string;

    @Field(type => String, {nullable: true})
    image: string | null;

    @Field()
    name: string;
}

@ObjectType()
class GetDialogsSchemeUser {
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
export class GetDialogsScheme {
    @Field(type => ID)
    id: string;

    @Field(type => ID)
    userId: string;

    @Field(type => GetDialogsSchemeLastMessages)
    lastMessage: GetDialogsSchemeLastMessages;

    @Field(type => String)
    status: string;

    @Field(type => GetDialogsSchemeInfo)
    info: GetDialogsSchemeInfo;

    @Field(type => [GetDialogsSchemeUser])
    users: GetDialogsSchemeUser[]
}
