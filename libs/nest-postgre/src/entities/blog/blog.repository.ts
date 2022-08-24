import { EntityRepository } from 'typeorm';
import { BlogEntity } from './blog.entity';
import { BaseRepository, BlogModel, BlogRepositoryInterface } from '@app/nest-postgre/entities';
import { GetSqlResponse, SqlToJsonModel } from '@app/common';

@EntityRepository(BlogEntity)
export class BlogRepository extends BaseRepository<BlogEntity> implements BlogRepositoryInterface {
    async getBlogsAndCommentsByUserId(userId: string) {
        const response: SqlToJsonModel<BlogModel>[] = await this.db.query(`
            SELECT coalesce(
                           (SELECT json_agg(
                                           json_build_object(
                                                   'id',
                                                   b.id,
                                                   'likes',
                                                   b.likes,
                                                   'views',
                                                   b.views,
                                                   'createdAt',
                                                   b.create_at,
                                                   'updatedAt',
                                                   b.update_at,
                                                   'comments',
                                               --                             coalesce(
--                                 (SELECT json_agg(row_to_json(postChild))
--                                  FROM posts postChild
--                                  WHERE postChild.parent_posts_id = p.id),
--                                 '[]'::json),
                                                   '[]'::json,
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
                                                   'text',
                                                   (SELECT json_agg(row_to_json(btb))
                                                    FROM blog_text_blocks btb
                                                    WHERE b.id = btb.post_owner),
                                                   'entityMap',
                                                   b.entity_map
                                               )::jsonb
                                       ) as query
                            FROM blogs b
                                     LEFT JOIN files mainImage on b.main_image_id = mainImage.id
                                     LEFT JOIN profiles p2 on u.id = p2.owner_id
                                     LEFT JOIN files avatar on p2.avatar_id = avatar.id
                            WHERE b.owner_id = u.id), '[]'::json
                       ) as rows
            FROM users u
            WHERE id = $1;
        `, [userId]);
        return new GetSqlResponse<BlogModel>().getRows(response);
    }

    async getBlogsByUser(userId: string) {
        const blogs = await this.find({
                where: {
                    owner: userId,
                },
                relations: ['owner'],
                order: {
                    createdAt: 'DESC',
                },
            },
        );
        return blogs;
    }
}
