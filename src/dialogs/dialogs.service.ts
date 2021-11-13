import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { DialogsModel } from './dialogs.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { AuthService } from '../auth/auth.service';
import { CreateDialogRequestDto } from './dto/create-dialog-request.dto';
import { MessagesService } from '../messages/messages.service';
import { UserModel } from '../users/user.model';
import { Types } from 'mongoose';
import { MessagesModel } from '../messages/messages.model';
import { UpdateOwnersRequestDto } from './dto/update-owners-request.dto';

@Injectable()
export class DialogsService {
    constructor(
        @InjectModel(DialogsModel) private readonly dialogsModel: ModelType<DialogsModel>,
        @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
        private readonly authService: AuthService,
        private readonly messagesService: MessagesService,
    ) {}

    async validateOwners(owners: Types.ObjectId[]) {
        return this.userModel.find({_id: { $in: owners}})
            .select('_id').exec().then(e => e.map(el => el._id))
    }

    async createDialog(authorization: string, {otherOwners, ...messageData}: CreateDialogRequestDto) {
        try {
            const user = await this.authService.verifyUser(authorization);
            const newMessage = await this.messagesService.createMessage(user._id, messageData)
            const validOwners = await this.validateOwners([user._id, ...otherOwners])

            const newDialog = await this.dialogsModel.create({
                owners: validOwners,
                messages: [
                    newMessage._id
                ]
            })

            await this.userModel.updateMany(
                {_id: { $in: validOwners}},
                {$push: { dialogs: newDialog._id }},
                {multi: true}
                )

            return newDialog

        } catch (e) {
            throw new BadRequestException(e)
        }
    }

    async getDialogs(authorization: string) {
        try {
            const user = await this.authService.verifyUser(authorization);

            return this.userModel.findById(user._id)
                .populate({
                    path: 'dialogs',
                    model: DialogsModel,
                    transform: (doc: DialogsModel) => {
                        doc.messages = [doc.messages[0]]
                        return doc
                    }
                }).exec()
                .then(doc => doc!.dialogs)

        } catch (e) {
            throw new BadRequestException(e)
        }
    }

    async getDialog(authorization: string, id: string) {
        try {
            const user = await this.authService.verifyUser(authorization);

            const dialog = await this.dialogsModel
                .findOne({ _id: id, owners: { $in: [user._id] }})
                .populate({ path: 'messages', model: MessagesModel })
                .populate({ path: 'owners', model: UserModel, select: 'name surname' })

            if (!dialog) {
                throw new BadRequestException('Диалога не существует')
            }

            return dialog

        } catch (e) {
            throw new BadRequestException(e)
        }
    }

    async updateDialogOwners(authorization: string, { dialogId, owners }: UpdateOwnersRequestDto) {
        try {
            const user = await this.authService.verifyUser(authorization);
            const oldDialog = await this.dialogsModel.findById(dialogId)

            if (!oldDialog) {
                throw new BadRequestException('Диалога не существует');
            }

            const updatedOwners = await this.validateOwners([user._id, ...owners])

            await this.userModel.updateMany(
                    {dialogs: { $in: [oldDialog]}},
                    {$pull: { dialogs: dialogId }},
                    {multi: true}
                )

            await this.userModel.updateMany(
                {_id: { $in: updatedOwners}},
                {$push: { dialogs: dialogId }},
                {multi: true}
            )

            const updatedDialog = await this.dialogsModel
                .findOneAndUpdate(
                    { _id: dialogId, owners: { $in: [user._id] }},
                    {owners: updatedOwners},
                    {new: true}
                )
                .populate({ path: 'owners', model: UserModel, select: 'name surname' })

            if (!updatedDialog) {
                throw new BadRequestException('Диалога не существует')
            }

            return updatedDialog

        } catch (e) {
            throw new BadRequestException(e)
        }
    }
}
