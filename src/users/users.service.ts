import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { BeAnObject, IObjectWithTypegooseFunction, ModelType } from '@typegoose/typegoose/lib/types';
import { UserModel } from './user.model';
import { Document, Types } from 'mongoose';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>
    ) {
    }

    async getUserById(id: string) {
        return this.userModel.findOne({ _id: id }, { 'passwordHash': false }).exec();
    }

    async getUsers() {
        return this.userModel.find({}, { 'passwordHash': false }).exec();
    }

    async getFollowUsers(id: string) {
        const friends: ((Document<Types.ObjectId, BeAnObject, any> & UserModel & IObjectWithTypegooseFunction & { _id: Types.ObjectId; }) | null)[] = []

        const { follow } = await this.userModel.find({ _id: id }, {follow: true}).then(f => f[0]);

        await (async () => {
            for (const id of follow) {
                const friend = await this.userModel.findOne({ _id: id })
                friends.push(friend)
            }
        })()

        return friends
    }
}
