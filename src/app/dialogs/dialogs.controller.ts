import { applyDecorators, Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { DialogsService } from './dialogs.service';
import { CreateDialogRequestDto } from './dto/create-dialog-request.dto';
import { IdValidationPipe } from '../../common/pipes/id-validation.pipe';
import { UpdateOwnersRequestDto } from './dto/update-owners-request.dto';
import { CreateDialogResponseDto } from './dto/create-dialog-response.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { GetDialogResponseDto } from './dto/get-dialog-response-dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ApiResponseOptions } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { User } from '../../common/decorators/user.decorator';
import { UserModel } from '../users/user.model';
import { UserEntity } from '../users/user.entity';

function SwaggerApi(createdResponse: ApiResponseOptions) {
    return applyDecorators(
        ApiBearerAuth(),
        ApiCreatedResponse(createdResponse),
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
        @User() user: UserEntity,
        @Body() dto: CreateDialogRequestDto,
    ) {
        return this.dialogsService.createDialog(user, dto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @SwaggerApi({
        description: 'Get dialogs',
        type: [GetDialogResponseDto],
    })
    async getDialogs(
        @User() user: UserEntity,
    ) {
        return this.dialogsService.getDialogs(user);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @SwaggerApi({
        description: 'Get dialog',
        type: GetDialogResponseDto,
    })
    async getDialog(
        @Param('id', IdValidationPipe) id: string,
        @User() user: UserEntity,
    ) {
        return this.dialogsService.getDialog(user, id);
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    @SwaggerApi({
        description: 'Update owners',
        type: GetDialogResponseDto,
    })
    async updateDialogOwners(
        @User() user: UserEntity,
        @Body() dto: UpdateOwnersRequestDto,
    ) {
        return this.dialogsService.updateDialogOwners(user, dto);
    }
}
