import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
// @ts-ignore
import { GraphQLUpload , graphqlUploadExpress } from 'graphql-upload'

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: 'schema.gql',
            installSubscriptionHandlers: true,
            debug: true,
            introspection: true,
            context: ({ req }) => ({ req }),
            formatError: error => {
                console.error('error', error)
                return error
            },
        }),
    ],
})
export class GraphqlLibModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(graphqlUploadExpress()).forRoutes('graphql')
    }
}
