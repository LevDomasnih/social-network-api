import { applyDecorators, Body, Controller, Get, Headers, Param, Post, Put, UseGuards } from '@nestjs/common';
import { DialogsService } from './dialogs.service';
import { CreateDialogRequestDto } from './dto/create-dialog-request.dto';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { UpdateOwnersRequestDto } from './dto/update-owners-request.dto';
import { CreateDialogResponseDto } from './dto/create-dialog-response.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { GetDialogResponseDto } from './dto/get-dialog-response-dto';
import { Ref } from '@typegoose/typegoose';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ApiResponseOptions } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { FileUploadDto } from '../posts/dto/file-upload.dto';

function SwaggerApi(createdResponse: ApiResponseOptions) {
    return applyDecorators(
        ApiBearerAuth(),
        ApiCreatedResponse(createdResponse)
    );
}


@ApiTags('dialogs')
@Controller('dialogs')
export class DialogsController {
    constructor(
        private readonly dialogsService: DialogsService,
    ) {
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @SwaggerApi({
        description: 'Create dialog',
        type: CreateDialogResponseDto,
    })
    async createDialog(
        @Headers('authorization') authorization: string,
        @Body() dto: CreateDialogRequestDto,
    ): Promise<CreateDialogResponseDto> {
        return this.dialogsService.createDialog(authorization, dto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @SwaggerApi({
        description: 'Get dialogs',
        type: [GetDialogResponseDto],
    })
    async getDialogs(
        @Headers('authorization') authorization: string,
    ): Promise<Ref<GetDialogResponseDto>[]> {
        return this.dialogsService.getDialogs(authorization);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @SwaggerApi({
        description: 'Get dialog',
        type: GetDialogResponseDto,
    })
    async getDialog(
        @Param('id', IdValidationPipe) id: string,
        @Headers('authorization') authorization: string,
    ): Promise<GetDialogResponseDto> {
        return this.dialogsService.getDialog(authorization, id);
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    @SwaggerApi({
        description: 'Update owners',
        type: GetDialogResponseDto,
    })
    async updateDialogOwners(
        @Headers('authorization') authorization: string,
        @Body() dto: UpdateOwnersRequestDto,
    ): Promise<GetDialogResponseDto> {
        return this.dialogsService.updateDialogOwners(authorization, dto);
    }
}
