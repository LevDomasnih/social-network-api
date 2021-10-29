import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop } from '@typegoose/typegoose';

export interface FollowModel extends Base { }
export class FollowModel extends TimeStamps {
    @prop()
    followId: string
}