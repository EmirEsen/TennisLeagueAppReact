export interface IPlayerProfile {
    id: string
    firstname: string
    lastname: string
    email: string
    gender: "MALE" | "FEMALE";
    dob: string
    heightInCm: string
    weightInKg: string
    rating: number
    matchPlayed: number
    win: number
    lose: number
    profileImageUrl: string
    isEmailVerified: boolean
}



