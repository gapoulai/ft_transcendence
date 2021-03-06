import { Link } from "react-router-dom"
import { useAuth } from "../../data/use-auth"
import useUser from "../../data/use-user"
import { Container, Nav, Navbar } from "react-bootstrap"
import UserAvatar from "../user/UserAvatar"
import "./topbar.scss"
import { NavLink } from "react-router-dom"
import { RestrictAnonymous, RestrictAuthenticated } from "../auth"
import { activeClassName } from "../../utils/active-class-name"

function Profile() {
    const auth = useAuth()
    const user = useUser(auth.userId)!

    return (
        <div className="d-flex">
            <span
                className="m-auto nav-link logout-but"
                onClick={() => auth.logout()}
            >
                Logout
            </span>
            <Link className="nav-link d-flex" to={`/users/${user.id}`}>
                <span className="m-auto">{user.nickname}</span>
                <UserAvatar userId={user.id} className="w-8 h-8 ms-2" />
            </Link>
        </div>
    )
}

export default function Topbar() {
    return (
        <Navbar bg="light" variant="dark" id="navbar">
            <Container>
                <Navbar.Brand>ft_pong</Navbar.Brand>

                <Navbar.Collapse>
                    <Nav className="me-auto">
                        <NavLink
                            className={activeClassName("nav-link")}
                            to="/"
                            end
                        >
                            Home
                        </NavLink>
                        <NavLink
                            className={activeClassName("nav-link")}
                            to="/leaderboard"
                            end
                        >
                            Leaderboard
                        </NavLink>
                        <RestrictAuthenticated>
                            <NavLink
                                className={activeClassName("nav-link")}
                                to="/chat"
                            >
                                Chat
                            </NavLink>
                        </RestrictAuthenticated>
                    </Nav>

                    <Nav>
                        <RestrictAuthenticated>
                            <Profile />
                        </RestrictAuthenticated>

                        <RestrictAnonymous>
                            <Link className="nav-link" to="/auth">
                                Sign in
                            </Link>
                            {/* Disable these on production */}
                            <Link
                                className="nav-link"
                                to="/auth/secret/fakeone"
                            >
                                Fake one sign in
                            </Link>
                            <Link
                                className="nav-link"
                                to="/auth/secret/faketwo"
                            >
                                Fake two sign in
                            </Link>
                        </RestrictAnonymous>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
