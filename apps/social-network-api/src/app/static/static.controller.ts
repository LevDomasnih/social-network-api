import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { User } from '@app/common';
import { UserEntity } from '@app/nest-postgre';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { StaticService } from './static.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('static')
export class StaticController {

    constructor(
        private readonly staticService: StaticService,
    ) {
    }

    @Get('TEMP/:fileName') // TODO МОЖНО REGEX ОПИСАТЬ
    @ApiCreatedResponse({ description: 'Get static files' })
    getTempStaticFile(
        @Param('fileName') fileName: string,
        @User() user: UserEntity,
    ) {
        return this.staticService.accessCheckAndGetFile(user, fileName);
    }

    @Get('PRIVATE/:fileName')
    @ApiCreatedResponse({ description: 'Get static files' })
    getPrivateStaticFile(
        @Param('fileName') fileName: string,
        @User() user: UserEntity,
    ) {
        return this.staticService.accessCheckAndGetFile(user, fileName);
    }
}