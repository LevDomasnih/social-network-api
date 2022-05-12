import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import {
    AuthLoginRequestDto,
    AuthLoginResponseDto,
    AuthRegisterRequestDto,
    AuthRegisterResponseDto,
    IsValidFieldsResponseDto,
} from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiCreatedResponse({
        description: 'User register',
        type: AuthRegisterResponseDto,
    })
    async register(@Body() dto: AuthRegisterRequestDto): Promise<AuthRegisterResponseDto> {
        return this.authService.register(dto);
    }

    @HttpCode(200)
    @Post('login')
    @ApiCreatedResponse({
        description: 'User login',
        type: AuthLoginResponseDto,
    })
    async login(@Body() dto: AuthLoginRequestDto): Promise<AuthLoginResponseDto> {
        return this.authService.login(dto);
    }

    @HttpCode(200)
    @Get('validate')
    @ApiCreatedResponse({
        description: 'is valid fields',
        type: IsValidFieldsResponseDto,
    })
    async isValidFields(@Query() query: {[key: string]: string}): Promise<IsValidFieldsResponseDto> {
        return this.authService.isValidFields(query)
    }
}
