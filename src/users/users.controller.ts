import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { User } from '../decorators/user.decorator';
import { UserModel } from './user.model';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(
        private readonly userService: UsersService,
    ) {
    }

    @Get()
    @ApiCreatedResponse({
        description: 'Get users',
    })
    async getUsers() {
        return this.userService.getUsers();
    }

    @Get('me')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({
        description: 'Get me',
    })
    async getMe(@User() user: UserModel) {
        return this.userService.getMe(user.id);
    }

    @Get(':id')
    @ApiCreatedResponse({
        description: 'Get user by id',
    })
    async getUserById(@Param('id') id: string) {
        return this.userService.getUserById(id);
    }

    @ApiCreatedResponse({
        description: 'Get members',
    })
    @Get('follow/:id')
    async getFollowUsers(@Param('id') id: string) {
        return this.userService.getFollowUsers(id);
    }
}
