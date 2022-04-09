import { PartialType } from '@nestjs/swagger';
import { DialogsModel } from '../dialogs.model';

export class CreateDialogResponseDto extends PartialType(DialogsModel) { }