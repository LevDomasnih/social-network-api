export interface GetPostsInterface {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    likes: number;
    isLiked: boolean;
    views: number,
    text: string,
    profile: {
        avatar: string | null;
        firstName: string,
        lastName: string,
    }
}
