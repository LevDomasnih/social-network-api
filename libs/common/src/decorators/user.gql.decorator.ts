import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';


export const UserGql = createParamDecorator((data: string, ctx: ExecutionContext) => {
    const request = GqlExecutionContext.create(ctx).getContext()
    return request.user;
});
