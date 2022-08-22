import { Outlet, NavLink, useNavigate } from "react-router-dom"
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useAuth } from "../../context/AuthContext";
import '../../css/layout.css'

const Layout = () => {
	const navigate = useNavigate()
	const {setUser} = useAuth()
	
	const handleBrand = () => {
		navigate('/')
	}

	const handleLogout = () => {
		localStorage.clear()
		setUser(false)
	}

	return (
		<>
			<Navbar bg="primary" variant="dark">
				<Container>
				<Navbar.Brand style={{cursor: "pointer"}} onClick={handleBrand}>PONG</Navbar.Brand>
				<Nav className="me-auto">
					<NavLink to="/" className={isActive => "nav-link" + (!isActive.isActive ? "" : " active")}>Home</NavLink>	
					<NavLink to="/profile" className={isActive => "nav-link" + (!isActive.isActive ? "" : " active")}>Profile</NavLink>
					<NavLink to="/settings" className={isActive => "nav-link" + (!isActive.isActive ? "" : " active")}>Settings</NavLink>
					<NavLink to="/friends" className={isActive => "nav-link" + (!isActive.isActive ? "" : " active")}>Friends</NavLink>
					<a style={{cursor: "pointer"}} onClick={handleLogout} className="nav-link">Çıkış yap</a>
				</Nav>
				</Container>
			</Navbar>
			<Container className="mt-3">
				<Outlet />
			</Container>
				
		</>
		
	)
}

export default Layout