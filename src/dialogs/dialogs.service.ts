import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { DialogsModel } from './dialogs.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { AuthService } from '../auth/auth.service';
import { CreateDialogDto } from './dto/create-dialog.dto';
import { MessagesService } from '../messages/messages.service';
import { UserModel } from '../users/user.model';

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
                .select('_id').exec().then(e => e.map(el => el._id))

            return this.dialogsModel.create({
                owners: [
                    ...validOwners,
                    user._id
                ],
                messages: [
                    newMessage._id
                ]
            })

        } catch (e) {
            throw new BadRequestException(e)
        }
    }
}
