export interface EditProfileInterfaceDto {
    middleName: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    login: string;
    birthday?: string;
    country?: string;
    city?: string;
    relatives?: string;
    school?: string;
    status?: string;
    about?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface EditProfileInterfaceReturn {
    updated: boolean
}
