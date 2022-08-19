import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
class GetUsersSchemeProfile {
    @Field(type => ID)
    id: string

    @Field()
    firstName: string

    @Field()
    lastName: string

    @Field()
    avatar: string

    @Field()
    phone: string

    @Field()
    middleName: string

    @Field(type => String, {nullable: true})
    mainImage: string | null

    @Field(type => String, {nullable: true})
    status: string | null

    @Field(type => String, {nullable: true})
    about: string | null

    @Field(type => String, {nullable: true})
    birthday: string | null

    @Field(type => String, {nullable: true})
    country: string | null

    @Field(type => String, {nullable: true})
    city: string | null

    @Field(type => String, {nullable: true})
    relatives: string | null

    @Field(type => String, {nullable: true})
    school: string | null
}

@ObjectType()
export class GetUserScheme {
    @Field(type => ID)
    id: string;

    @Field()
    email: string;

    @Field()
    login: string;

    @Field(type => GetUsersSchemeProfile)
    profile: GetUsersSchemeProfile
}
