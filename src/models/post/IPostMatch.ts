export interface score {
    player1Id: string
    player1Score: number
    player2Id: string
    player2Score: number
}

export interface IPostMatch {
    tournamentId: string
    court?: string
    date: string
    time?: string
    player1Id: string
    player2Id: string
    score: score[]
}
