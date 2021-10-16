import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from './user.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { AuthDto } from './dto/auth.dto';
import { genSalt, hash } from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>
    ) { }

    async createUser(dto: AuthDto) {
        const salt = await genSalt(10)
        const newUser = new this.userModel({
            email: dto.login,
            passwordHash: await hash(dto.password, salt)
        })

        await newUser.save()

        return {
            password: dto.password,
            passwordHash: await hash(dto.password, salt)
        }
    }

    async findUser(email: string) {
        return this.userModel.findOne({email}).exec()
    }
}
