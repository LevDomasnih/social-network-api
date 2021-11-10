import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { DialogsModel } from './dialogs.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { AuthService } from '../auth/auth.service';
import { CreateDialogDto } from './dto/create-dialog.dto';
import { MessagesService } from '../messages/messages.service';
import { UserModel } from '../users/user.model';
import { Types } from 'mongoose';
import { MessagesModel } from '../messages/messages.model';
import { ProfileModel } from '../profile/profile.model';

@Injectable()
export class DialogsService {
    constructor(
        @InjectModel(DialogsModel) private readonly dialogsModel: ModelType<DialogsModel>,
        @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
        private readonly authService: AuthService,
        private readonly messagesService: MessagesService,
    ) {}

    async createDialog(authorization: string, {otherOwners, ...messageData}: CreateDialogDto) {
        try {
            const decodeData = await this.authService.verifyUser(authorization);

            const user = await this.userModel.findOne({email: decodeData.email}).exec()

            if (!user) {
                throw new BadRequestException('Данного пользователя не существует');
            }

            const newMessage = await this.messagesService.createMessage(user._id, messageData)

            const validOwners = await this.userModel.find({_id: { $in: otherOwners}})
                .select('_id').exec().then(e => [ user._id,...e.map(el => el._id)])

            const newDialog = await this.dialogsModel.create({
                owners: validOwners,
                messages: [
                    newMessage._id
                ]
            })

            await this.userModel.updateMany(
                {_id: { $in: validOwners}},
                {$push: { dialogs: newDialog._id }},
                {multi: true, new: true}
                )

            return newDialog

        } catch (e) {
            throw new BadRequestException(e)
        }
    }

    async getDialogs(authorization: string) {
        try {
            const decodeData = await this.authService.verifyUser(authorization);

            const user = await this.userModel.findOne({email: decodeData.email}).exec()

            if (!user) {
                throw new BadRequestException('Данного пользователя не существует');
            }

            return this.userModel.findById(user._id)
                .populate({
                    path: 'dialogs',
                    model: DialogsModel,
                    transform: (doc: DialogsModel) => {
                        doc.messages = [doc.messages[0]]
                        return doc
                    }
                }).exec()
                .then(doc => doc?.dialogs)

        } catch (e) {
            throw new BadRequestException(e)
        }
    }

    async getDialog(authorization: string, id: Types.ObjectId) {
        try {
            const decodeData = await this.authService.verifyUser(authorization);

            const user = await this.userModel.findOne({email: decodeData.email}).exec()

            if (!user) {
                throw new BadRequestException('Данного пользователя не существует');
            }

            return this.dialogsModel
                .findOne({ _id: id, owners: { $in: [user._id] }})
                .populate({ path: 'messages', model: MessagesModel })
                .populate({ path: 'owners', model: UserModel, select: 'name surname' })

        } catch (e) {
            throw new BadRequestException(e)
        }
    }
}
