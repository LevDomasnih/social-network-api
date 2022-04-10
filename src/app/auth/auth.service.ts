import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRegisterRequestDto } from './dto/auth-register/auth-register.request.dto';
import { compare, genSalt, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginRequestDto } from './dto/auth-login/auth-login.request.dto';
import { UsersRepository } from '../users/users.repository';
import { ProfileRepository } from '../profile/profile.repository';
import { PostsRepository } from '../posts/posts.repository';
import { FollowRepository } from '../follow/follow.repository';
import { IsValidFieldsRequestDto } from './dto/is-valid-fields/is-valid-fields.request.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UsersRepository,
        private readonly profileRepository: ProfileRepository,
        private readonly postsRepository: PostsRepository,
        private readonly followRepository: FollowRepository,
        private readonly jwtService: JwtService,
    ) {
    }

    async login({ login, password }: AuthLoginRequestDto) {
        const { email } = await this.validateUser(login, password);
        return this.createAccessToken(email);
    }

    async register(dto: AuthRegisterRequestDto) {
        const oldUser = (await this.findUser({email: dto.email}))[0];

        if (oldUser) {
            throw new BadRequestException('Данный пользователь уже зарегистрирован!');
        }

        return this.createUser(dto);
    }

    async verifyUser(token: string, options = {}) {
        try {
            const decodeData = await this.jwtService.verifyAsync(token.split(' ')[1]);
            const user = await this.userRepository.findOne({ email: decodeData.email });
            if (!user) {
                throw new BadRequestException('Данного пользователя не существует');
            }
            return user;
        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    async isValidFields(dto: IsValidFieldsRequestDto) {
        return {
            valid: await this.userRepository.existsByOptions(dto)
        };
    }

    private async createAccessToken(email: string) {
        const payload = { email };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    private async createUser({ email, password, login, ...dto }: AuthRegisterRequestDto) {
        const salt = await genSalt(10);
        try {
            const userInstance = this.userRepository.create({
                email: email,
                passwordHash: await hash(password, salt),
                login,
            });
            const user = await this.userRepository.save(userInstance);
            const follow = await this.followRepository.create({
                owner: user,
            });
            const profile = this.profileRepository.create({
                owner: user,
                ...dto,
            });
            await this.followRepository.save(follow);
            await this.profileRepository.save(profile);
            return this.createAccessToken(email);
        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    private async findUser(options: {[key: string]: string}) {
        return this.userRepository.find({where: Object.keys(options).map(e => ({[e]: options[e]})),  select: ['passwordHash', 'email'] });
    }

    private async validateUser(login: string, password: string) {
        const user = (await this.findUser({login}))[0];
        if (!user) {
            throw new UnauthorizedException('Данного пользователя не существует');
        }
        const isCorrectPassword = await compare(password, user.passwordHash);
        if (!isCorrectPassword) {
            throw new UnauthorizedException('Неверный пароль');
        }
        return { email: user.email };
    }
}
