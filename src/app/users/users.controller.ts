import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { User } from '../../common/decorators/user.decorator';
import { FollowUsersModel } from './models/follow-users.model';
import { UserEntity } from './user.entity';
import { UserMeModel } from './models/user-me.model';
import { GetUserMeResponseDto } from './dto/get-user-me-response.dto';

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
    async getUsers(): Promise<UserEntity[]> {
        return this.userService.getUsers();
    }

    @Get('me')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({
        description: 'Get me',
        type: GetUserMeResponseDto
    })
    async getMe(@User() user: UserEntity): Promise<GetUserMeResponseDto> {
        return this.userService.getMe(user.id);
    }

    @Get(':id')
    @ApiCreatedResponse({
        description: 'Get user by id',
    })
    async getUserById(@Param('id') id: string): Promise<UserEntity> {
        return this.userService.getUserById(id);
    }

    @ApiCreatedResponse({
        description: 'Get members',
    })
    @Get('follow/:id')
    async getFollowUsers(@Param('id') id: string): Promise<FollowUsersModel[] | []> {
        return this.userService.getFollowUsers(id);
    }
}
