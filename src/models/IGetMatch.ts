export interface score {
    player1Id: string
    player1Score: number
    player2Id: string
    player2Score: number
}

export interface IGetMatch {
    court?: string
    date: string
    time?: string
    id: string
    player1Id: string
    player2Id: string
    score: score[]
    winnerId: string
    createdAt: string
    player1RatingChange: number
    player2RatingChange: number
}



