import "./style.css"
import React from "react"
import { Table } from "react-bootstrap"
import { User, useUser } from "../../data/users"
import { Match, useMatches } from "../../data/matches"
import UserAvatar from "../user/UserAvatar"
import { AuthState, useAuth } from "../../data/use-auth"
import { Link } from "react-router-dom"

interface Player {
    id: number
    rank: number
    victories: number
}

function formatTable(matches: Match[]) {
    const res = new Map<number, Player>()

    matches.forEach((match) => {
        const p1 = match.playerOneId
        const p2 = match.playerTwoId
        if (!res.get(p1)) res.set(p1, { id: p1, rank: -1, victories: 0 })
        if (!res.get(p2)) res.set(p2, { id: p2, rank: -1, victories: 0 })
        const winner =
            match.state === "player_one_won"
                ? p1
                : match.state === "player_two_won"
                ? p2
                : undefined
        if (winner) {
            const currentData = res.get(winner)
            currentData!.victories++
            res.set(winner, currentData!)
        }
    })
    const final = Array.from(res.values())
    final.sort((a, b) => {
        if (a.victories > b.victories) return -1
        else if (a.victories < b.victories) return 1
        else return 0
    })
    for (let index = 0; index < final.length; index++)
        final[index].rank = index + 1
    return final
}

function LeaderBoardComponent({
    player,
    className,
}: {
    player: Player
    className: string
}) {
    const user = useUser(player.id)!

    return (
        <tr className={className}>
            <td>{player.rank}</td>
            <td>
                <UserAvatar userId={user.id} className="w-8 h-8 me-2" />
                <Link
                    to={`/users/${player.id}`}
                    className="m-auto mx-3 fs-4 text-decoration-none"
                >
                    {user.nickname}
                </Link>
            </td>
            <td>{player.victories}</td>
        </tr>
    )
}

function LeaderboardTabComponent(user: User | null) {
    const matches = useMatches()
    const players = formatTable(matches)

    return (
        <Table striped bordered hover variant="dark">
            <thead>
                <tr>
                    <th>#rank</th>
                    <th>Login</th>
                    <th>Victories</th>
                </tr>
            </thead>
            <tbody>
                {players.map((player) => (
                    <LeaderBoardComponent
                        key={player.id}
                        player={player}
                        className={
                            player.id === user?.id ? "leaderBoardYou" : ""
                        }
                    />
                ))}
            </tbody>
        </Table>
    )
}

function AuthComponent(auth: AuthState) {
    const user = useUser(auth.userId!)!
    return LeaderboardTabComponent(user)
}

export default function LeaderboardTab() {
    const auth = useAuth()
    return auth.connected ? AuthComponent(auth) : LeaderboardTabComponent(null)
}
