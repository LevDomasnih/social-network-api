import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        private readonly authService: AuthService
    ) {
        super()
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const bearerToken = request.headers.authorization;
        const user = await this.authService.verifyUser(bearerToken);
        request.user = user;

        return !!user;
    }
}
