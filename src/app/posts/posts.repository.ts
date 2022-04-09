import { EntityManager, EntityRepository, getManager, Repository } from 'typeorm';
import { PostEntity } from './post.entity';
import { PostWithCommentsModel } from './models/post-with-comments.model';

@EntityRepository(PostEntity)
export class PostsRepository extends Repository<PostEntity> {
    db: EntityManager;

    constructor() {
        super();
        this.db = getManager();
    }

    async getPostAndCommentsByUserId(userId: string): Promise<PostWithCommentsModel> {
        return (await this.db.query(`
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
        `, [userId]))[0]?.rows ?? [];
    }
}
