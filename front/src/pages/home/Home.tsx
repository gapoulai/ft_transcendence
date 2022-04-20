import React from "react"
import { Link } from "react-router-dom"
import { Button, Container } from "react-bootstrap"
import "./home.scss"
import { useAuth } from "../../data/use-auth"
import SectionFriends from "./friends"
import Particles from "react-tsparticles"
import SectionMatches from "./matches"

function Animation(props: any) {
    return (
        <Particles
            id="tsparticles"
            options={{
                background: {
                    color: {
                        value: "",
                    },
                },
                fullScreen: {
                    enable: true,
                    zIndex: 0, // or any value is good for you, if you use -1 set `interactivity.detectsOn` to `"window"` if you need mouse interactions
                },
                fpsLimit: 60,
                interactivity: {
                    detect_on: "window",
                    events: {
                        onClick: {
                            enable: true,
                            mode: "push",
                        },
                        onHover: {
                            enable: true,
                            mode: "repulse",
                        },
                        resize: true,
                    },
                    modes: {
                        bubble: {
                            distance: 400,
                            duration: 2,
                            opacity: 0.8,
                            size: 40,
                        },
                        push: {
                            quantity: 4,
                        },
                        repulse: {
                            distance: 200,
                            duration: 0.4,
                        },
                    },
                },
                particles: {
                    color: {
                        value: "#ffffff",
                    },
                    links: {
                        color: "#ffffff",
                        distance: 150,
                        enable: true,
                        opacity: 0.5,
                        width: 1,
                    },
                    collisions: {
                        enable: true,
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        outMode: "bounce",
                        random: false,
                        speed: 2,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 800,
                        },
                        value: 50,
                    },
                    opacity: {
                        value: 0.5,
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        random: true,
                        value: 5,
                    },
                },
                detectRetina: true,
            }}
        />
    )
}

export default function Home() {
    const auth = useAuth()

    return (
        <div>
            <Animation />
            <Container>
                <div className="welcome-bar">
                    <div className="text-center my-5">
                        <h1>Welcome to ft_pong</h1>
                        <p className="desc">Let's play a pong match !</p>
                        <img
                            src="/assets/pong.png"
                            className="w-25 img"
                            alt=""
                        />
                    </div>
                </div>
                <div className="d-flex justify-content-center">
                    <Link to="/game/matchmaking">
                        <Button
                            className="play-button p-2"
                            size="lg"
                            variant="warning"
                        >
                            <p>JVEU GAME</p>
                        </Button>
                    </Link>
                </div>
                {auth.connected && <SectionFriends />}
                <SectionMatches />
            </Container>
        </div>
    )
}
