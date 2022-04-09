import { applyDecorators, Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { DialogsService } from './dialogs.service';
import { CreateDialogRequestDto } from './dto/create-dialog-request.dto';
import { IdValidationPipe } from '../../common/pipes/id-validation.pipe';
import { UpdateOwnersRequestDto } from './dto/update-owners-request.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ApiResponseOptions } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { User } from '../../common/decorators/user.decorator';
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
    })
    async updateDialogOwners(
        @User() user: UserEntity,
        @Body() dto: UpdateOwnersRequestDto,
    ) {
        return this.dialogsService.updateDialogOwners(user, dto);
    }
}
