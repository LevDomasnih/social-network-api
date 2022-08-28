import { Field, ObjectType } from '@nestjs/graphql';
import { FilesEntity } from '@app/nest-postgre';

@ObjectType()
export class GetUserBaseInfo {
    @Field()
    id: string

    @Field()
    login: string;

    @Field()
    email: string;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    middleName: string;

    @Field(type => FilesEntity, {nullable: true})
    avatar: FilesEntity;
}
