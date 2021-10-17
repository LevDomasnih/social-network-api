import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { UserModel } from './user.model';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
    ) { }

    async getUserById(id: string) {
        return this.userModel.findOne({ _id: id, }, { 'passwordHash': false } ).exec()
    }

    async getUsers() {
        return this.userModel.find({}, {'passwordHash': false }).exec()
    }
}
