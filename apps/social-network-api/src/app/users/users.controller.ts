import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { IdValidationPipe, User } from '@app/common';
import { UserEntity } from '@app/nest-postgre';
import { GetFollowUsersResponseDto, GetMeResponseDto, GetUserByIdResponseDto, GetUsersResponseDto } from './dto';

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
