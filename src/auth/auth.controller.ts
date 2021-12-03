import { BadRequestException, Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRegisterRequestDto } from './dto/auth-register-request.dto';
import { AuthLoginResponseDto } from './dto/auth-login-response.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AuthRegisterResponseDto } from './dto/auth-register-response.dto';
import { AuthLoginRequestDto } from './dto/auth-login-request.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @UsePipes(new ValidationPipe())
    @Post('register')
    @ApiCreatedResponse({
        description: 'User register',
        type: AuthRegisterResponseDto,
    })
    async register(@Body() dto: AuthRegisterRequestDto): Promise<AuthRegisterResponseDto> {
        const oldUser = await this.authService.findUser(dto.email);
        if (oldUser) {
            throw new BadRequestException('Данный пользователь уже зарегистрирован!');
        }

        return this.authService.createUser(dto);
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post('login')
    @ApiCreatedResponse({
        description: 'User login',
        type: AuthLoginResponseDto,
    })
    async login(@Body() { email, password }: AuthLoginRequestDto): Promise<AuthLoginResponseDto> {
        await this.authService.validateUser(email, password);
        return this.authService.login(email);
    }
}
