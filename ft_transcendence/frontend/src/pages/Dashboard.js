import {useAuth} from '../context/AuthContext'
import {Card, Button} from 'react-bootstrap'

const Dashboard = () => {
	const {user} = useAuth()

	return (
		<>
			<h1>Welcome to the PONGAME {user.name} {user.surname}</h1>
		</>	
	)
}

export default Dashboard;