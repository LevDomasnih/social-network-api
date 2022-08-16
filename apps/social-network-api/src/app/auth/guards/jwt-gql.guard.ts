import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtGqlGuard extends AuthGuard('jwt') {
    constructor(
        private readonly authService: AuthService
    ) {
        super()
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = GqlExecutionContext.create(context).getContext();
        const bearerToken = request.req.headers.authorization;
        const user = await this.authService.verifyUser(bearerToken);
        request.user = user;

        return !!user;
    }
}
