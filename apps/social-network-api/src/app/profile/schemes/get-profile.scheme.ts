import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetProfileScheme {
    @Field(type => String, { nullable: true })
    avatar: string | null;
    @Field(type => String, { nullable: true })
    mainImage: string | null;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    middleName: string;

    @Field()
    phone: string;

    @Field(type => String, { nullable: true })
    status?: string;

    @Field(type => String, { nullable: true })
    about?: string;

    @Field(type => Date, { nullable: true })
    birthday?: Date;

    @Field(type => String, { nullable: true })
    country?: string;

    @Field(type => String, { nullable: true })
    city?: string;

    @Field(type => String, { nullable: true })
    relatives?: string;

    @Field(type => String, { nullable: true })
    school?: string;
}
