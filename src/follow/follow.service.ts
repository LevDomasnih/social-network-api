import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { FollowModel } from './follow.model';
import { ModelType } from '@typegoose/typegoose/lib/types';

@Injectable()
export class FollowService {
    constructor(
        @InjectModel(FollowModel) private readonly followModel: ModelType<FollowModel>
    ) { }

    async createFollow(userId: string) {
        return this.followModel.create({ userId, follow: []})
    }
}
