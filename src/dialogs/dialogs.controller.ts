import { Body, Controller, Get, Headers, Param, Post, Put } from '@nestjs/common';
import { DialogsService } from './dialogs.service';
import { CreateDialogDto } from './dto/create-dialog.dto';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { Types } from 'mongoose';

@Controller('dialogs')
export class DialogsController {
    constructor(
        private readonly dialogsService: DialogsService
    ) {}

    @Post()
    async createDialog(
        @Headers('authorization') authorization: string,
        @Body() dto: CreateDialogDto
    ) {
        return this.dialogsService.createDialog(authorization, dto)
    }

    @Get()
    async getDialogs(
        @Headers('authorization') authorization: string,
    ) {
        return this.dialogsService.getDialogs(authorization)
    }

    @Get(':id')
    async getDialog(
        @Param('id', IdValidationPipe) id: Types.ObjectId,
        @Headers('authorization') authorization: string,
    ) {
        return this.dialogsService.getDialog(authorization, id)
    }

    @Put()
    async updateDialogOwners(
        @Headers('authorization') authorization: string,
    ) {

    }
}
