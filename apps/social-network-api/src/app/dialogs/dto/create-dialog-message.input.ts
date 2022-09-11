import { Field, ID, InputType } from '@nestjs/graphql';
import { FilesEntity } from '@app/nest-postgre';

@InputType()
export class CreateDialogMessageInput {
    @Field()
    text: string;

    @Field(type => ID)
    dialogId: string;
}
