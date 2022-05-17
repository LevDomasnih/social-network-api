import { EntityRepository } from 'typeorm';
import { PostEntity } from './post.entity';
import { BaseRepository, PostsRepositoryInterface, PostsWithCommentsModel } from '@app/nest-postgre/entities';
import { GetSqlResponse, SqlToJsonModel } from '@app/common';

@EntityRepository(PostEntity)
export class PostsRepository extends BaseRepository<PostEntity> implements PostsRepositoryInterface {
    async getPostsAndCommentsByUserId(userId: string) {
        const response: SqlToJsonModel<PostsWithCommentsModel>[] = await this.db.query(`
            SELECT coalesce(
                (SELECT
                    json_agg(
                        json_build_object(
                            'id',
                            p.id,
                            'likes',
                            p.likes,
                            'views',
                            p.views,
                            'createdAt',
                            p.create_at,
                            'updatedAt',
                            p.update_at,
                            'comments',
                            coalesce(
                                (SELECT json_agg(row_to_json(postChild))
                                 FROM posts postChild
                                 WHERE postChild.parent_posts_id = p.id),
                                '[]'::json),
                            'profile',
                            json_build_object(
                                'firstName',
                                p2.first_name,
                                'lastName',
                                p2.last_name,
                                'middleName',
                                p2.middle_name,
                                'avatar',
                                'http://localhost:3000/PUBLIC/' || avatar.name
                            ),
                            'mainImage',
                            'http://localhost:3000/PUBLIC/' || mainImage.name,
                            'textBlocks',
                            (SELECT json_agg(row_to_json(ptb)) FROM post_text_blocks ptb WHERE p.id = ptb.post_owner),
                            'entityMap',
                            p.entity_map
                        )::jsonb
                ) as query
                FROM posts p
                LEFT JOIN files mainImage on p.main_image_id = mainImage.id
                LEFT JOIN profiles p2 on u.id = p2.owner_id
                LEFT JOIN files avatar on p2.avatar_id = avatar.id
                WHERE p.owner_id = u.id
                ), '[]'::json
            ) as rows
            FROM users u
            WHERE id = $1;
        `, [userId]);
        return new GetSqlResponse<PostsWithCommentsModel>().getRows(response);
    }
}
