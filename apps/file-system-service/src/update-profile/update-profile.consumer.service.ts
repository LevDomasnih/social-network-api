import { AmqpConnection, Nack, RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { UpdateProfileService } from './update-profile.service';
import { Injectable, Logger } from '@nestjs/common';
import { classToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateProfileRequestDto } from './dto/update-profile.request.dto';
import { UpdateProfileFileContract } from '@app/amqp-contracts';
import { FolderName, Status } from '@app/nest-postgre';

@Injectable()
export class UpdateProfileConsumerService {
    private readonly logger = new Logger(UpdateProfileConsumerService.name);

    constructor(
        private readonly amqpConnection: AmqpConnection,
        private readonly updateProfileService: UpdateProfileService,
    ) {
    }

    @RabbitRPC(UpdateProfileFileContract.queue)
    async updateFile(
        request: UpdateProfileFileContract.RequestPayload,
    ): Promise<UpdateProfileFileContract.ResponsePayload | Nack> {
        const requestWithDefaultValue = new UpdateProfileRequestDto(
            {
                folder: FolderName.PUBLIC,
                status: Status.SAVED,
                lastProlong: new Date(),
                ...request,
            });
        // this.logger.verbose({
        //     query: UpdateProfileFileContract.queue.routingKey,
        //     request: requestWithDefaultValue
        // })
        console.dir(requestWithDefaultValue) // FIXME вынести в логгер
        const errors = await validate(classToClass(requestWithDefaultValue));
        if (errors.length) {
            this.logger.warn({
                query: UpdateProfileFileContract.queue.routingKey,
                errors,
            });
            return new Nack(false);
        }

        return this.updateProfileService.updateFile(requestWithDefaultValue);
    }
}
