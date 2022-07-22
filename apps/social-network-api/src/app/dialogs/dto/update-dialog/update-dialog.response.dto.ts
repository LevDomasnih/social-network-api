import { BaseCustomEntity } from '@app/nest-postgre';

export class UpdateDialogResponseDto extends BaseCustomEntity {
    dialogId: string;
    id: string;
    ownerId: string;
    text: string;
}
