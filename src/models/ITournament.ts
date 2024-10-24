import { TournamentPrivacy } from "./enums/TournamentPrivacy"

export interface ITournament {
    id: string
    title: string
    info: string
    privacy: TournamentPrivacy
    isDurationFinite: boolean
    start: string | null
    end: string | null
    status: "ONGOING" | "COMPLETED" | "UPCOMING";
    createdById: string
    createdAt: String
    updatedAt: string
}
