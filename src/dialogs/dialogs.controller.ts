import { Body, Controller, Get, Headers, Post, Put } from '@nestjs/common';
import { DialogsService } from './dialogs.service';
import { CreateDialogDto } from './dto/create-dialog.dto';

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

    }

    @Put()
    async updateDialogOwners(
        @Headers('authorization') authorization: string,
    ) {

    }
}
