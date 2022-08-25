import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { DialogsService } from './dialogs.service';
import { UseGuards } from '@nestjs/common';
import { JwtGqlGuard } from '../auth/guards/jwt-gql.guard';
import { IdValidationPipe } from '@app/common';
import { UserGql } from '@app/common/decorators/user.gql.decorator';
import { DialogsEntity, DialogsRepository, ProfileEntity, UserEntity, UsersRepository } from '@app/nest-postgre';
import { GetDialogScheme } from './schemes/get-dialog.scheme';
import { GetDialogsScheme } from './schemes/get-dialogs.scheme';

@Resolver(() => DialogsEntity)
export class DialogsResolver {
    constructor(
        private readonly dialogsService: DialogsService,
        private readonly dialogsRepository: DialogsRepository,
        private readonly usersRepository: UsersRepository,
    ) {
    }

    @Query(returns => DialogsEntity)
    @UseGuards(JwtGqlGuard)
    async getDialog(
        @Args('id', { type: () => String }, IdValidationPipe) id: string,
        @UserGql() user: UserEntity,
    ): Promise<DialogsEntity | undefined> {
        return this.dialogsRepository.getDialogByUser(user.id, id);
    }

    @Query(returns => [DialogsEntity])
    @UseGuards(JwtGqlGuard)
    async getDialogs(
        @UserGql() user: UserEntity,
    ): Promise<DialogsEntity[]> {
        return this.usersRepository.getUserDialogsById(user.id);
    }
    //
    // @ResolveField(returns => [UserEntity], { name: 'dialogs' })
    // async getDialogUser(
    //     @Parent() dialog: DialogsEntity,
    // ) {
    //     return this.usersRepository.getUserById(dialog.id);
    // }

    // @ResolveField(returns => [UserEntity], { name: 'dialog' })
    // async getDialogByUsers(
    //     @Args('userConsumedId', { type: () => String }, IdValidationPipe) userConsumedId: string,
    //     @Parent() dialog: DialogsEntity,
    // ) {
    //     // return this.usersRepository.getUserById(user.id);
    // }

}
