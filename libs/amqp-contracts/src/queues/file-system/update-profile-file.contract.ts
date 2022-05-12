import { FILE_SYSTEM_EXCHANGE } from '@app/amqp-contracts/exchanges/file-system.exchange';
import { AmqpBaseMessage, CustomMessageHandlerOptions } from '@app/amqp-contracts/common';
import { FolderName, Status, UserEntity } from '@app/nest-postgre';

export namespace UpdateProfileFileContract {

    /**
     * ### Сохранение файла а файловой системе
     * Exchange:
     *      name: `file-system`
     *      type: `direct`
     *      routingKey: 'update-profile-file'
     *      queue: `update-profile-file`
     *      Тип очереди: RPC
     */

    export const queue: CustomMessageHandlerOptions = {
        exchange: FILE_SYSTEM_EXCHANGE.name,
        routingKey: 'update-profile-file',
        queue: 'update-profile-file',
        queueOptions: {
            durable: true,
            deadLetterExchange: FILE_SYSTEM_EXCHANGE.name,
            deadLetterRoutingKey: `x-dead-${FILE_SYSTEM_EXCHANGE.name}`
        },
    }

    /**
     * Отправка данных для генерации документа
     */
    export type message = AmqpBaseMessage<RequestPayload>;

    /**
     * Ответ
     */
    export type response = AmqpBaseMessage<ResponsePayload>;


    /** Тело запроса */
    export interface RequestPayload {

        /** Буфер файла */
        buffer: Buffer;
        /** Чей файл */
        user: UserEntity;
        /** Какое имя будет добавлено при создании */
        fileField: string;
        /** Старый путь к файлу (прим. обновился аватар, надо удалить старый) */
        oldPath?: string;
        /** В какую папку сохранить, отвечает за уровень доступа (PUBLIC по умолчанию) */
        folder?: FolderName;
        /** Статус файла (SAVED по умолчанию) */
        status?: Status;
        /** Дата конечной пролонгации (new Date() по умолчанию) */
        lastProlong?: Date;

    }

    /** Тело ответа */
    export interface ResponsePayload {

        /** В какую папку сохранить, отвечает за уровень доступа (PUBLIC по умолчанию) */
        folder: FolderName;
        /** Путь к файлу */
        path: string;
        /** Имя файла */
        name: string;
        /** Статус файла */
        status: Status;
        /** До какого момента продлен файл */
        lastProlong: Date;
        /** MIME-type файла */
        mime: string;
        /** Размер файла */
        size: number;

    }
}