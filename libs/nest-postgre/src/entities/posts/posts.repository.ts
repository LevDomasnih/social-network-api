import { EntityRepository } from 'typeorm';
import { PostEntity } from './post.entity';
import { BaseRepository, PostsRepositoryInterface, PostsWithCommentsModel } from '@app/nest-postgre/entities';
import { GetSqlResponse, SqlToJsonModel } from '@app/common';

@EntityRepository(PostEntity)
export class PostsRepository extends BaseRepository<PostEntity> implements PostsRepositoryInterface {
    async getPostsAndCommentsByUserId(userId: string): Promise<PostsWithCommentsModel[]> {
        const response: SqlToJsonModel<PostsWithCommentsModel>[] = await this.db.query(`
            SELECT coalesce((SELECT json_agg(row_to_json(p)::jsonb || json_build_object(
                    'comments',
                    coalesce(
                            (SELECT json_agg(row_to_json(postChild))
                             FROM posts postChild
                             WHERE postChild."parentPostsId" = p.id),
                            '[]'::json)
                )::jsonb)
                             FROM posts p
                             WHERE p."ownerId" = u.id
                               AND p."parentPostsId" IS NULL), '[]'::json) as rows
            FROM users u
            WHERE id = $1;
        `, [userId]);
        return new GetSqlResponse<PostsWithCommentsModel>().getRows(response);
    }
}
