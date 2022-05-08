import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class JwtWsAuthGuard extends AuthGuard('jwt') {
    constructor(
        private readonly authService: AuthService
    ) {
        super()
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToWs().getClient()
        const bearerToken = request.handshake.headers.authorization
        const user = await this.authService.verifyUser(bearerToken)
        request.user = user

        return !!user
    }
}