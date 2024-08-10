export interface IUpdatePlayerProfile {
    firstname: string,
    lastname: string,
    dob: string,
    heightInCm: string,
    weightInKg: string,
    avatar: File | null
}