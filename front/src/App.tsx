import { ErrorBoundary } from "react-error-boundary"
import { StrictMode, Suspense, useEffect } from "react"
import { BrowserRouter } from "react-router-dom"
import { AuthProvider, useAuth } from "./data/use-auth"
import { useWebSocket, WebsocketProvider } from "./data/use-websocket"
import { ReadyState } from "react-use-websocket"
import { setAccessToken } from "./data/use-fetch"
import Loading from "./components/Loading"

import Router from "./pages/Router"

function RootProvider({ children }) {
    return (
        <StrictMode>
            <AuthProvider>
                <WebsocketProvider>
                    <BrowserRouter>{children}</BrowserRouter>
                </WebsocketProvider>
            </AuthProvider>
        </StrictMode>
    )
}

function WebsocketTokenIssuer({ children }) {
    const { token } = useAuth()
    const { sendMessage, readyState } = useWebSocket()

    useEffect(() => {
        console.log("token issuer", readyState, ReadyState, token)
        if (readyState === ReadyState.OPEN) {
            if (token) {
                sendMessage("login", token)
            } else {
                sendMessage("logout")
            }
        }

        setAccessToken(token)
    }, [token, readyState])

    if (readyState !== ReadyState.OPEN) {
        return <Loading />
    }

    return children
}

export default function App() {
    return (
        <RootProvider>
            <ErrorBoundary
                fallbackRender={({ error }) => (
                    <p>Error??? {error.toString()}</p>
                )}
            >
                <Suspense fallback={<p>No fallback so loading here :)</p>}>
                    <WebsocketTokenIssuer>
                        <Router />
                    </WebsocketTokenIssuer>
                </Suspense>
            </ErrorBoundary>
        </RootProvider>
    )
}
