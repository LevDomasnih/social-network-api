export class PostWithCommentsModel {
    id: string;
    text: string;
    image: string;
    likes: 0;
    views: 0;
    ownerId: string;
    comments: PostWithCommentsModel[];
    parentPostsId: string | null;
}
