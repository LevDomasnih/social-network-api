import { Field, ID, ObjectType } from '@nestjs/graphql';
import { FollowEntity } from '@app/nest-postgre';

@ObjectType()
export class FollowScheme {
    @Field(type => ID)
    id: string;

    @Field(type => Date)
    updatedAt: Date

    @Field(type => Date)
    createdAt: Date

    @Field(type => FollowEntity)
    subscriber: FollowEntity

    @Field(type => FollowEntity)
    subscriberOwner: FollowEntity
}
