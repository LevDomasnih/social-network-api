import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { graphqlUploadExpress } from 'graphql-upload';

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: 'schema.graphql',
            installSubscriptionHandlers: true,
            debug: true,
            introspection: true,
            cors: { origin: true, credentials: true },
            context: ({ req, res }) => ({ req, res }),
            formatError: error => {
                console.error('error', error);
                return error;
            },
        }),
    ],
})
export class GraphqlLibModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(graphqlUploadExpress()).forRoutes('graphql');
    }
}
