import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterScheme } from './schemes/register.scheme';
import { LoginScheme } from './schemes/login.scheme';
import { IsValidScheme } from './schemes/is-valid.scheme';
import { IsValidDto, LoginDto, RegisterDto } from './dto';

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
}
