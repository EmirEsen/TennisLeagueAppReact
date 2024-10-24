export interface IUpdatePlayerProfile {
    firstname: string,
    lastname: string,
    gender: string,
    dob: string,
    heightInCm: string,
    weightInKg: string,
    avatar: File | null
}