import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { GetUserResponseDto } from './dto/get-user-response-dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Ref } from '@typegoose/typegoose';

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
