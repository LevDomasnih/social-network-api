import { EntityManager, EntityRepository, getManager } from 'typeorm';
import { DialogsEntity } from './dialogs.entity';
import { BaseRepository } from '../../common/repositories/base/base.repository';
import { SqlToJsonModel } from '../../common/model/sql-to-json.model';
import { GetSqlResponse } from '../../common/helpers/get-sql-response';

@EntityRepository(DialogsEntity)
export class DialogsRepository extends BaseRepository<DialogsEntity> {
    db: EntityManager;

    constructor() {
        super();
        this.db = getManager();
    }

    async getDialogsByUserId(userId: string) {
        const response: SqlToJsonModel<any>[] = await this.db.query(`
            SELECT json_agg(
                                   row_to_json(d)::jsonb ||
                                   (SELECT row_to_json(dou)
                                    FROM dialogs_owners_users dou
                                    WHERE d.id = dou."dialogsId"
                                      AND dou."usersId" = $1)::jsonb ||
                                   json_build_object(
                                           'lastMessage',
                                           (SELECT json_agg(row_to_json(m) ORDER BY id) FROM messages m)::json -> 0
                                       )::jsonb
                       ) as rows
            FROM dialogs d;
        `, [userId]);
        return new GetSqlResponse<any>().getRows(response)
    }

    async getDialogsById(userId: string, id: string) {
        const response = await this.db.query(`
            SELECT json_agg(
                                   row_to_json(d)::jsonb ||
                                   (SELECT row_to_json(dou)
                                    FROM dialogs_owners_users dou
                                    WHERE d.id = dou."dialogsId"
                                      AND dou."usersId" = $1)::jsonb ||
                                   json_build_object(
                                           'lastMessage',
                                           (SELECT json_agg(row_to_json(m) ORDER BY id) FROM messages m)
                                       )::jsonb
                       ) as rows
            FROM dialogs d
            WHERE id = $2;
        `, [userId, id]);
        return new GetSqlResponse<any>().getRows(response)
    }
}
