
export interface Roles {
    analyst?: boolean;
    approver?: boolean;
    admin?: boolean;
}

export interface User {
    uid: string;
    email?: string | null;
    photoURL?: string;
    displayName?: string;
    roles: Roles;
    dateCreated: string;
}
