import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRegisterRequestDto } from './dto/auth-register/auth-register.request.dto';
import { AuthLoginResponseDto } from './dto/auth-login/auth-login.response.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AuthRegisterResponseDto } from './dto/auth-register/auth-register.response.dto';
import { AuthLoginRequestDto } from './dto/auth-login/auth-login.request.dto';

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
    @Post('validate')
    @ApiCreatedResponse({
        description: 'is valid email',
        type: Boolean,
    })
    async isValidEmail(@Body() dto: {email: string}): Promise<boolean> {
        return this.authService.isValidEmail(dto)
    }
}
