import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { User } from '../../common/decorators/user.decorator';
import { UserEntity } from './user.entity';
import { GetUsersResponseDto } from './dto/get-users/get-users.response.dto';
import { GetMeResponseDto } from './dto/get-me/get-me.response.dto';
import { GetUserByIdResponseDto } from './dto/get-user-by-id/get-user-by-id.response.dto';
import { GetFollowUsersResponseDto } from './dto/get-follow-users/get-follow-users.response.dto';
import { IdValidationPipe } from '../../common/pipes/id-validation.pipe';

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
        type: [GetUsersResponseDto],
    })
    async getUsers(): Promise<GetUsersResponseDto[]> {
        return this.userService.getUsers();
    }

    @Get('me')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({
        description: 'Get me',
        type: GetMeResponseDto,
    })
    async getMe(@User() user: UserEntity): Promise<GetMeResponseDto> {
        return this.userService.getUserById(user.id);
    }

    @Get(':id')
    @ApiCreatedResponse({
        description: 'Get user by id',
        type: GetUserByIdResponseDto,
    })
    async getUserById(@Param('id', IdValidationPipe) id: string): Promise<GetUserByIdResponseDto> {
        return this.userService.getUserById(id);
    }

    @ApiCreatedResponse({
        description: 'Get members',
        type: [GetFollowUsersResponseDto],
    })
    @Get('follow/:id')
    async getFollowUsers(@Param('id', IdValidationPipe) id: string): Promise<GetFollowUsersResponseDto[]> {
        return this.userService.getFollowUsers(id);
    }
}
