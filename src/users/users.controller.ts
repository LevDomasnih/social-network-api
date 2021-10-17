import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Get()
    async getUsers() {
        return this.userService.getUsers()
    }

    @Get(':id')
    async getUserById(@Param('id') id: string) {
        return this.userService.getUserById(id)
    }
}
