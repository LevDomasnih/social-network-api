import { Args, Query, Resolver } from '@nestjs/graphql';
import { DialogsService } from './dialogs.service';
import { UseGuards } from '@nestjs/common';
import { JwtGqlGuard } from '../auth/guards/jwt-gql.guard';
import { IdValidationPipe } from '@app/common';
import { UserGql } from '@app/common/decorators/user.gql.decorator';
import { UserEntity } from '@app/nest-postgre';
import { GetDialogScheme } from './schemes/get-dialog.scheme';
import { GetDialogsScheme } from './schemes/get-dialogs.scheme';

@Resolver()
export class DialogsResolver {
    constructor(
        private readonly dialogsService: DialogsService,
    ) {
    }

    @Query(returns => GetDialogScheme)
    @UseGuards(JwtGqlGuard)
    async getDialog(
        @Args('id', { type: () => String }, IdValidationPipe) id: string,
        @UserGql() user: UserEntity,
    ): Promise<GetDialogScheme> {
        return this.dialogsService.getUserDialog(user, id);
    }

    @Query(returns => [GetDialogsScheme])
    @UseGuards(JwtGqlGuard)
    async getDialogs(
        @UserGql() user: UserEntity,
    ): Promise<GetDialogsScheme[]> {
        return this.dialogsService.getDialogs(user);
    }
}
