import { TournamentPrivacy } from "../enums/TournamentPrivacy"

export interface IPostTournament {
    title: string
    info: string
    privacy: TournamentPrivacy
    isDurationFinite: boolean
    startDate: string | null
    endDate: string | null
    createdById: string
    participantIds: string[]
    updatedAt: string
}