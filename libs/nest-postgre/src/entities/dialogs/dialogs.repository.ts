import { EntityRepository } from 'typeorm';
import { DialogsEntity } from './dialogs.entity';
import { GetSqlResponse, SqlToJsonModel } from '@app/common';
import {
    BaseRepository,
    DialogsRepositoryInterface,
    GetDialogByIdModel,
    GetDialogByUserIdModel,
} from '@app/nest-postgre/entities';

@EntityRepository(DialogsEntity)
export class DialogsRepository extends BaseRepository<DialogsEntity> implements DialogsRepositoryInterface {
    async getDialogsByUserId(userId: string): Promise<GetDialogByUserIdModel[]> {
        const response: SqlToJsonModel<GetDialogByUserIdModel>[] = await this.db.query(`
            SELECT json_agg(
                                   json_build_object(
                                           'id',
                                           d.id,
                                           'status',
                                           d.status,
                                           'users',
                                           (SELECT json_agg(json_build_object(
                                                   'id',
                                                   u.id,
                                                   'firstName',
                                                   p.first_name,
                                                   'lastName',
                                                   p.last_name,
                                                   'avatar',
                                                   'http://localhost:3000/PUBLIC/' || avatar.name
                                               ))
                                            FROM dialogs_users du
                                                     LEFT JOIN users u on u.id = du.users_id
                                                     LEFT JOIN profiles p on u.id = p.owner_id
                                                     LEFT JOIN files avatar on avatar.id = p.avatar_id
                                            WHERE d.id = du.dialogs_id
                                           ),
                                           'userId',
                                           (SELECT du3.users_id FROM dialogs_users du3 WHERE du3.dialogs_id = d.id AND du3.users_id != $1)
                                       )::jsonb ||
                                   json_build_object(
                                           'lastMessage',
                                           (SELECT json_agg(json_build_object(
                                                                    'id',
                                                                    m.id,
                                                                    'text',
                                                                    m.text,
                                                                    'ownerId',
                                                                    m.owner_id,
                                                                    'createAt',
                                                                    m.create_at,
                                                                    'updateAt',
                                                                    m.update_at
                                                                ) ORDER BY create_at DESC)
                                            FROM messages m
                                            WHERE m.dialog_id = d.id
                                            )::json -> 0
                                       )::jsonb
                       ) as rows
            FROM dialogs d
            LEFT JOIN dialogs_users du2 on d.id = du2.dialogs_id
            WHERE du2.users_id = $1;
        `, [userId]);
        return new GetSqlResponse<GetDialogByUserIdModel>().getRows(response);
    }

    async getDialogsById(userId: string, id: string): Promise<{} | GetDialogByIdModel> {
        const response: SqlToJsonModel<GetDialogByIdModel>[] = await this.db.query(`
            SELECT json_agg(
                                   json_build_object(
                                           'id',
                                           d.id,
                                           'status',
                                           d.status,
                                           'createAt',
                                           d.create_at,
                                           'updateAt',
                                           d.update_at
                                       )::jsonb ||
                                   (SELECT json_build_object(
                                                   'userId',
                                                   du.users_id
                                               )
                                    FROM dialogs_users du
                                    WHERE d.id = du.dialogs_id
                                      AND du.users_id = $1)::jsonb ||
                                   json_build_object(
                                           'messages',
                                           (SELECT json_agg(json_build_object(
                                                                    'id',
                                                                    m.id,
                                                                    'text',
                                                                    m.text,
                                                                    'ownerId',
                                                                    m.owner_id,
                                                                    'createAt',
                                                                    m.create_at,
                                                                    'updateAt',
                                                                    m.update_at
                                                                ) ORDER BY id)
                                            FROM messages m)
                                       )::jsonb
                       ) as rows
            FROM dialogs d
            WHERE id = $2;
        `, [userId, id]);
        return new GetSqlResponse<GetDialogByIdModel>().getRow(response);
    }

    async getDialogByUsersId(currentUser: string, secondUser: string) {
        const response: SqlToJsonModel<{}>[] = await this.db.query(`
            SELECT json_agg(json_build_object(
                                    'id',
                                    d.id,
                                    'status',
                                    d.status,
                                    'user',
                                    (SELECT json_build_object(
                                            'id',
                                            u.id,
                                            'firstName',
                                            p.first_name,
                                            'lastName',
                                            p.last_name,
                                            'avatar',
                                            'http://localhost:3000/PUBLIC/' || avatar.name
                                        )
                                     FROM users u
                                     LEFT JOIN profiles p on u.id = p.owner_id
                                     LEFT JOIN files avatar on avatar.id = p.avatar_id
                                     WHERE u.id = (SELECT du3.users_id FROM dialogs_users du3 WHERE du3.dialogs_id = d.id AND du3.users_id != $1)
                                    ),
                                    'users',
                                    (SELECT json_agg(json_build_object(
                                            'id',
                                            u.id,
                                            'firstName',
                                            p.first_name,
                                            'lastName',
                                            p.last_name,
                                            'avatar',
                                            'http://localhost:3000/PUBLIC/' || avatar.name
                                        ))
                                     FROM dialogs_users du
                                              LEFT JOIN users u on u.id = du.users_id
                                              LEFT JOIN profiles p on u.id = p.owner_id
                                              LEFT JOIN files avatar on avatar.id = p.avatar_id
                                     WHERE d.id = du.dialogs_id
                                    )
                                )::jsonb || json_build_object(
                                    'messages',
                                    (SELECT json_agg(json_build_object(
                                                             'id',
                                                             m.id,
                                                             'text',
                                                             m.text,
                                                             'ownerId',
                                                             m.owner_id,
                                                             'createAt',
                                                             m.create_at,
                                                             'updateAt',
                                                             m.update_at,
                                                             'dialogId',
                                                             m.dialog_id
                                                         ) ORDER BY create_at DESC)
                                     FROM messages m
                                     WHERE m.dialog_id = d.id
                                    )
                                )::jsonb) as rows
            FROM dialogs d
            WHERE (SELECT du.dialogs_id
                   FROM (SELECT *
                         FROM dialogs_users du
                         WHERE du.users_id = $1) as du
                            LEFT JOIN dialogs_users du1 on $2 = du1.users_id
                   WHERE du1.dialogs_id = du.dialogs_id) = d.id;
        `, [currentUser, secondUser]);
        return new GetSqlResponse<{}>().getRow(response);
    }

    async findDialog(ownerId1: string, ownerId2: string) {
        const response: SqlToJsonModel<{}>[] = await this.db.query(`
            SELECT json_agg(row_to_json(rows)) as rows
            FROM dialogs rows
            WHERE (SELECT du.dialogs_id
                   FROM (SELECT *
                         FROM dialogs_users du
                         WHERE du.users_id = $1) as du
                            LEFT JOIN dialogs_users du1 on $2 = du1.users_id
                   WHERE du1.dialogs_id = du.dialogs_id) = rows.id
        `, [ownerId1, ownerId2]);
        return new GetSqlResponse<{}>().getRow(response);
    }
}
