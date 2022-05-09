import {
    AmqpConnection,
    MessageHandlerErrorBehavior,
    Nack,
    RabbitRPC,
} from '@golevelup/nestjs-rabbitmq';
import { UpdateProfileService } from './update-profile.service';
import { Injectable, Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateProfileRequestDto } from './dto/update-profile.request.dto';

@Injectable()
export class UpdateProfileConsumerService {
    private readonly logger = new Logger(UpdateProfileConsumerService.name);

    constructor(
        private readonly amqpConnection: AmqpConnection,
        private readonly updateProfileService: UpdateProfileService
    ) {
    }

    @RabbitRPC({
        exchange: 'file-system',
        routingKey: 'update-profile-file',
        queue: 'update-profile-file',
        errorBehavior: MessageHandlerErrorBehavior.NACK,
        queueOptions: {
            durable: true,
            deadLetterExchange: 'file-system',
            deadLetterRoutingKey: 'x-dead-file-system',
        },
    })
    async updateFile(request: UpdateProfileRequestDto) {
        const errors = await validate(plainToClass(UpdateProfileRequestDto, request));
        if (errors.length) {
            this.logger.warn({
                query: 'fp-html2pdf-sync',
                errors,
            });
            return new Nack(false);
        }
        console.log(this.updateProfileService);
        return this.updateProfileService.updateFile(request)
    }
}
