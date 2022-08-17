import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterScheme } from './schemes/register.scheme';
import { LoginScheme } from './schemes/login.scheme';
import { IsValidScheme } from './schemes/is-valid.scheme';
import { IsValidDto, LoginDto, RegisterDto } from './dto';
import { AuthScheme } from './schemes/auth.scheme';
import { UseGuards } from '@nestjs/common';
import { JwtGqlGuard } from './guards/jwt-gql.guard';
import { UserEntity } from '@app/nest-postgre';
import { UserGql } from '@app/common/decorators/user.gql.decorator';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) { }

    @Mutation(returns => RegisterScheme)
    async register(
        @Args('registerData') registerDto: RegisterDto,
    ): Promise<RegisterScheme> {
        return this.authService.register(registerDto);
    }

    @Query(returns => LoginScheme)
    login(@Args() loginDto: LoginDto): Promise<LoginScheme> {
        return this.authService.login(loginDto);
    }

    @Query(returns => IsValidScheme)
    isValidFields(@Args() isValidDto: IsValidDto): Promise<IsValidScheme> {
        return this.authService.isValidFields(isValidDto);
    }

    @Query(returns => AuthScheme, {name: 'auth'})
    @UseGuards(JwtGqlGuard)
    getAuth(
        @UserGql() user: UserEntity
    ): Promise<AuthScheme> {
        return this.authService.getAuth(user.id);
    }
}
