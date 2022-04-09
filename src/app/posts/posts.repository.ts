import { EntityRepository } from 'typeorm';
import { PostEntity } from './post.entity';
import { PostsWithCommentsModel } from './models/posts-with-comments-model';
import { BaseRepository } from '../../common/repositories/base/base.repository';
import { PostsRepositoryInterface } from './interfaces/posts-repository.interface';
import { GetSqlResponse } from '../../common/helpers/get-sql-response';
import { SqlToJsonModel } from '../../common/model/sql-to-json.model';

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
