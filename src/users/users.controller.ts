import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { GetUserResponseDto } from './dto/get-user-response-dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Ref } from '@typegoose/typegoose';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { User } from '../decorators/user.decorator';
import { UserModel } from './user.model';
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
        type: [GetUserResponseDto],
    })
    async getUsers(): Promise<GetUserResponseDto[]> {
        return this.userService.getUsers();
    }

    @Get('me')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({
        description: 'Get me',
        type: GetUserMeResponseDto,
    })
    async getMe(@User() user: UserModel): Promise<GetUserMeResponseDto> {
        return this.userService.getMe(user.id);
    }

    @Get(':id')
    @ApiCreatedResponse({
        description: 'Get user by id',
        type: () => GetUserResponseDto,
    })
    async getUserById(@Param('id') id: string): Promise<GetUserResponseDto> {
        return this.userService.getUserById(id);
    }

    @ApiCreatedResponse({
        description: 'Get members',
        type: [GetUserResponseDto],
    })
    @Get('follow/:id')
    async getFollowUsers(@Param('id') id: string): Promise<Ref<GetUserResponseDto>[]> {
        return this.userService.getFollowUsers(id);
    }
}
