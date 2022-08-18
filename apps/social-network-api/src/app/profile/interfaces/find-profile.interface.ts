export interface FindProfileInterface {
    avatar: string | null;
    mainImage: string | null;
    firstName: string;
    lastName: string;
    middleName: string;
    phone: string;
    status?: string;
    about?: string;
    birthday?: Date;
    country?: string;
    city?: string;
    relatives?: string;
    school?: string;
}
