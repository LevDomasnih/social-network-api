import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Prop } from '@typegoose/typegoose';

export interface FollowModel extends Base {}
export class FollowModel extends TimeStamps {

    @Prop()
    userId: string

    @Prop({type: () => [String]})
    follow: string[]
}