import { Args, ID, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { DialogsService } from './dialogs.service';
import { UseGuards } from '@nestjs/common';
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

@Resolver(() => DialogsEntity)
export class DialogsResolver {
    constructor(
        private readonly dialogsService: DialogsService,
        private readonly dialogsRepository: DialogsRepository,
        private readonly usersRepository: UsersRepository,
        private readonly messagesRepository: MessagesRepository,
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
}
