import { EntityManager, EntityRepository, getManager, Repository } from 'typeorm';
import { DialogsEntity } from './dialogs.entity';

@EntityRepository(DialogsEntity)
export class DialogsRepository extends Repository<DialogsEntity> {
    db: EntityManager;

    constructor() {
        super();
        this.db = getManager();
    }

    async getDialogsByUserId(userId: string) {
        return (await this.db.query(`
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
        `, [userId]))[0]?.rows ?? []
    }

    async getDialogsById(userId: string, id: string) {
        return (await this.db.query(`
            SELECT json_agg(
                                   row_to_json(d)::jsonb ||
                                   (SELECT row_to_json(dou) FROM dialogs_owners_users dou
                                    WHERE d.id = dou."dialogsId"
                                      AND dou."usersId" = $1)::jsonb ||
                                   json_build_object(
                                           'lastMessage',
                                           (SELECT json_agg(row_to_json(m) ORDER BY id) FROM messages m)::json->0
                                       )::jsonb
                       )::json->0 as row
            FROM dialogs d
            WHERE id = $2;
        `, [userId, id]))[0]?.row ?? {}
    }
}
