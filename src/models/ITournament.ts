import { IPlayerProfile } from "./IPlayerProfile"

export interface ITournament {
    id: string
    title: string
    info: string
    start: string
    end: string
    createdById: string
    participantIds: string[]
    managerIds: string[]
    createdAt: String
    updatedAt: string
    players?: IPlayerProfile[];
}
