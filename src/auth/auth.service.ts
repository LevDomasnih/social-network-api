import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRegisterRequestDto } from './dto/auth-register-request.dto';
import { compare, genSalt, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginRequestDto } from './dto/auth-login-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileEntity } from '../profile/profile.entity';
import { PostEntity } from '../posts/post.entity';
import { FollowEntity } from '../follow/follow.entity';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UsersRepository,
        @InjectRepository(ProfileEntity) private readonly profileRepository: Repository<ProfileEntity>,
        @InjectRepository(PostEntity) private readonly postRepository: Repository<PostEntity>,
        @InjectRepository(FollowEntity) private readonly followRepository: Repository<FollowEntity>,
        private readonly jwtService: JwtService,
    ) {
    }

    async login({ login, password }: AuthLoginRequestDto) {
        const { email } = await this.validateUser(login, password);
        return this.createAccessToken(email);
    }

    async register(dto: AuthRegisterRequestDto) {
        const oldUser = await this.findUser(dto.email);

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

    async isValidEmail(dto: { email: string }) {
        return this.userRepository.existsByOptions(dto)
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

    private async findUser(login: string) {
        return this.userRepository.findOne({ login });
    }

    private async validateUser(login: string, password: string) {
        const user = await this.findUser(login);
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
