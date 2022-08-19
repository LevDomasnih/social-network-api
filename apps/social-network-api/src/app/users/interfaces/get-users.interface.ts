export interface GetUsersInterfaceReturn {
    id: string;
    email: string;
    login: string;
    profile: {
        id: string
        firstName: string
        lastName: string
        avatar: string
        phone: string
        middleName: string
        mainImage: string | null
        status: string | null
        about: string | null
        birthday: string | null
        country: string | null
        city: string | null
        relatives: string | null
        school: string | null
    }
}
