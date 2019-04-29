export enum Gender {
    MALE,
    FEMALE
}

export interface Person {
    age: number;
    avatar: string;
    city: string;
    country: string;
    countryCode: string;
    dateCreated: string;
    email: string;
    firstname: string;
    followers: string;
    gender: Gender;
    lastName: string;
    latitude: number;
    longtitude: number;
    phrase: string;
    uid: string;
}
