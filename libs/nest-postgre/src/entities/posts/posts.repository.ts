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
                             WHERE postChild.parent_posts_id = p.id),
                            '[]'::json)
                )::jsonb)
                             FROM posts p
                             WHERE p.owner_id = u.id
                               AND p.parent_posts_id IS NULL), '[]'::json) as rows
            FROM users u
            WHERE id = $1;
        `, [userId]);
        return new GetSqlResponse<PostsWithCommentsModel>().getRows(response);
    }
}
