import { IsOptional, IsString } from 'class-validator';

export class UpdateDialogRequestDto {

    @IsString()
    text: string;

    @IsString()
    dialogId: string;

    @IsString()
    @IsOptional()
    image: string;

    @IsString()
    @IsOptional()
    file: string;
}
