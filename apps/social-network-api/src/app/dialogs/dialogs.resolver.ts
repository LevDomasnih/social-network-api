import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql';
import { DialogsService } from './dialogs.service';
import { Inject, UseGuards } from '@nestjs/common';
import { JwtGqlGuard } from '../auth/guards/jwt-gql.guard';
import { IdValidationPipe } from '@app/common';
import { UserGql } from '@app/common/decorators/user.gql.decorator';
import {
    DialogsEntity,
    DialogsRepository,
    MessagesEntity,
    MessagesRepository,
    UserEntity,
    UsersRepository,
} from '@app/nest-postgre';
import { DialogInfoSchema } from '@app/graphql-lib/schemes/dialog-info.schema';
import { PUB_SUB } from '../../pub-sub/pub-sub.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { CreateDialogMessageInput } from './dto/create-dialog-message.input';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import gqlFileUploadConvert from '@app/common/helpers/gql-file-upload-convert';

const MESSAGE_CREATED = 'messageCreated';

@Resolver(() => DialogsEntity)
export class DialogsResolver {
    constructor(
        private readonly dialogsService: DialogsService,
        private readonly dialogsRepository: DialogsRepository,
        private readonly usersRepository: UsersRepository,
        private readonly messagesRepository: MessagesRepository,
        @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
    ) {
    }

    @Query(returns => DialogsEntity, { name: 'dialog' })
    @UseGuards(JwtGqlGuard)
    async getDialog(
        @Args('id', { type: () => ID }, IdValidationPipe) id: string,
        @UserGql() user: UserEntity,
    ): Promise<DialogsEntity | undefined> {
        return this.dialogsRepository.getDialogByUser(user.id, id);
    }

    @Query(returns => [DialogsEntity], { name: 'dialogs' })
    @UseGuards(JwtGqlGuard)
    async getDialogs(
        @UserGql() user: UserEntity,
    ): Promise<DialogsEntity[]> {
        return this.usersRepository.getUserDialogsById(user.id);
    }

    @ResolveField(returns => MessagesEntity, { name: 'lastMessage' })
    async getLastMessage(
        @Parent() dialogsEntity: DialogsEntity,
    ) {
        return this.messagesRepository.getLastMessage(dialogsEntity.id);
    }

    @ResolveField(returns => DialogInfoSchema, { name: 'info' })
    @UseGuards(JwtGqlGuard)
    async getInfo(
        @Parent() dialogsEntity: DialogsEntity,
        @UserGql() user: UserEntity,
    ) {
        return this.dialogsRepository.getInfo(dialogsEntity.id, user.id);
    }

    @ResolveField(returns => [MessagesEntity], { name: 'messages' })
    async getMessages(
        @Parent() dialogsEntity: DialogsEntity,
    ) {
        return this.messagesRepository.getMessages(dialogsEntity.id);
    }

    @Mutation(returns => MessagesEntity)
    @UseGuards(JwtGqlGuard)
    async createMessage(
        @UserGql() user: UserEntity,
        @Args({ name: 'image', type: () => GraphQLUpload }) imageUpload: FileUpload,
        @Args({ name: 'file', type: () => GraphQLUpload }) fileUpload: FileUpload,
        @Args('data') createDialogMessageInput: CreateDialogMessageInput
    ) {
        const newMessage = await this.dialogsService.updateDialog(user, {
            dialogId: createDialogMessageInput.dialogId,
            image: await gqlFileUploadConvert(imageUpload),
            text: createDialogMessageInput.text,
            file: await gqlFileUploadConvert(fileUpload)
        })
        const owners = (await this.dialogsRepository.findOne(createDialogMessageInput.dialogId,
            {relations: ['owners']}
        ))?.owners
        owners?.filter(own => own.id !== user.id).forEach(own => {
            this.pubSub.publish(`${MESSAGE_CREATED}/${own.id}`, { messageCreated: newMessage });
        })
        return newMessage
    }

    @Subscription(returns => MessagesEntity, {
        name: 'messageCreated'
    })
    @UseGuards(JwtGqlGuard)
    async subscribeToCreateMessage(
        @UserGql() user: UserEntity,
    ) {
        return this.pubSub.asyncIterator(`${MESSAGE_CREATED}/${user.id}`);
    }
}
