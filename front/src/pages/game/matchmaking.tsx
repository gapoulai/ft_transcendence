import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../../data/use-websocket";

export default function Matchmaking() {
    const navigate = useNavigate()
    const { subscribe, sendMessage } = useWebSocket()
    const [error, setError] = useState(false)

    useEffect(() => {
        const { unsubscribe } = subscribe((event, data) => {
            if (event === "game.waiting.error.alreadysubscribed") {
                setError(true)
            }

            if (event === "game.waiting.success") {
                navigate(`/game/${data.id}`, { replace: true })
            }
        })

        sendMessage("game.waiting.ready", { id: 0 })

        return () => {
            sendMessage("game.waiting.unready", { id: 0 })
            unsubscribe()
        }
    }, [])

    if (error) {
        return <p>Already subscribed to matchmaking on another window</p>
    }

    return <p>Waiting for another player!</p>
}
