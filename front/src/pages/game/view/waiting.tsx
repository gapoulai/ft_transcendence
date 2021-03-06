import { useEffect, useState } from "react"
import { Button, Container } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useMutateDirectChannel } from "../../../data/channels"
import { useMatch } from "../../../data/matches"
import { useMutateSendMessage } from "../../../data/messages"
import { useAuth } from "../../../data/use-auth"
import { fetcherDelete, useSubmit } from "../../../data/use-fetch"
import { useWebSocket } from "../../../data/use-websocket"
import { useUser } from "../../../data/users"

function ReadyButton({ matchId }) {
    const [ready, setReady] = useState(false)
    const [error, setError] = useState(false)
    const { subscribe, sendMessage } = useWebSocket()

    useEffect(() => {
        if (!ready) {
            return
        }

        const { unsubscribe } = subscribe((event) => {
            if (event === "game.waiting.error.alreadysubscribed") {
                setError(true)
                setReady(false)
            }
        })

        sendMessage("game.waiting.ready", { id: matchId })

        return () => {
            sendMessage("game.waiting.unready", { id: matchId })
            unsubscribe()
        }
    }, [ready, matchId])

    if (error) {
        // TODO: Retry button?
        return <p>Already waiting in another session</p>
    }

    if (ready) {
        return <Button onClick={() => setReady(false)}>Unready</Button>
    }

    return <Button onClick={() => setReady(true)}>Ready</Button>
}

function MessageButton({ matchId, targetUserId }) {
    const mutateDirect = useMutateDirectChannel()
    const mutateMessage = useMutateSendMessage()
    const loading = mutateDirect.isLoading || mutateMessage.isLoading

    async function sendMessage() {
        const channel = await mutateDirect.submit(targetUserId)

        await mutateMessage.submit({
            channelId: channel.id,
            content: `#game:${matchId}#`,
        })
    }

    console.log(mutateDirect.isLoading, mutateMessage.isLoading, loading)

    return (
        <Button disabled={loading} onClick={sendMessage}>
            {loading ? "Sending..." : "Send message to opponent"}
        </Button>
    )
}

function CancelButton({ matchId }) {
    const navigate = useNavigate()
    const mutate = useSubmit<{ id: number }, void>((match) =>
        fetcherDelete(`/matches/${match.id}`)
    )

    async function deleteMatch() {
        await mutate.submit({ id: matchId })

        navigate("/")
    }

    return (
        <Button disabled={mutate.isLoading} onClick={deleteMatch} variant="danger">
            {mutate.isLoading ? "Cancelling..." : "Cancel the match"}
        </Button>
    )
}

export default function GameViewWaiting({ matchId }) {
    const auth = useAuth()
    const match = useMatch(matchId)!
    const playerOne = useUser(match.playerOneId)!
    const playerTwo = useUser(match.playerTwoId)!

    return (
        <Container className="mt-3">
            <h2>Game waiting</h2>
            <p>Waiting for the match to start with {playerOne.nickname} vs {playerTwo.nickname}.</p>

            {auth.connected &&
                [playerOne.id, playerTwo.id].includes(auth.userId) && (
                    <div className="d-flex gap-2">
                        <ReadyButton matchId={match.id} />
                        <MessageButton
                            matchId={match.id}
                            targetUserId={
                                playerOne.id === auth.userId
                                    ? playerTwo.id
                                    : playerOne.id
                            }
                        />
                        <CancelButton matchId={match.id} />
                    </div>
                )}
        </Container>
    )
}
