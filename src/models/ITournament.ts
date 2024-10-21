export interface ITournament {
    id: string
    title: string
    info: string
    start: string
    end: string
    status: "ONGOING" | "COMPLETED" | "UPCOMING";
    createdById: string
    createdAt: String
    updatedAt: string
}
