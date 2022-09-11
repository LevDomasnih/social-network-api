export interface GetUserByIdInterfaceReturn {
    id: string;
    email: string;
    login: string;
    profile: {
        id: string
        firstName: string
        lastName: string
        avatar: string | null
        phone: string
        middleName: string
        mainImage: string | null
        status?: string | null
        about?: string | null
        birthday?: Date | null
        country?: string | null
        city?: string | null
        relatives?: string | null
        school?: string | null;
    }
}
