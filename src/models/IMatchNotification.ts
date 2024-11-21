export interface IMatchNotification {
    id: string
    matchId: string
    tournamentId: string
    title: string
    message: string
    createdAt: string | null
    isRead: boolean
}                                    