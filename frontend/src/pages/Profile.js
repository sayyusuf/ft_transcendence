import { Card, Col, Row } from "react-bootstrap"
import { useAuth } from "../context/AuthContext"

const Profile = () => {
	const { user } = useAuth()

	return (
		<>
			<Card style={{backgroundImage: `url(${user.coalition_img})`}}>
				<Card.Body>
					<Row>
						<Col className="col-3">
							<img src={`${user.avatar}`} width="100%" className="rounded-circle" />
						</Col>
						<Col className="col-4">
							<Card className="card-dark">
								<Card.Body>
								<Row>
									<Col className="col-12 p-2">
										<b style={{color: `${user.coalition_color}`}}>Nickname: </b>
										<b className="d-inline-block text-white ml-2">{user.nick}</b>
									</Col>
									<Col className="col-12 p-2">
										<b style={{color: `${user.coalition_color}`}}>Name: </b>
										<b className="d-inline-block text-white ml-2">{user.name}</b>
									</Col>
									<Col className="col-12 p-2">
										<b style={{color: `${user.coalition_color}`}}>Surname: </b>
										<b className="d-inline-block text-white ml-2">{user.surname}</b>
									</Col>
									<Col className="col-12 p-2">
										<b style={{color: `${user.coalition_color}`}}>Wins: </b>
										<b className="d-inline-block text-white ml-2">{user.win}</b>
									</Col>
									<Col className="col-12 p-2">
										<b style={{color: `${user.coalition_color}`}}>Loses: </b>
										<b className="d-inline-block text-white ml-2">{user.win}</b>
									</Col>
									<Col className="col-12 p-2">
										<b style={{color: `${user.coalition_color}`}}>Level: </b>
										<b className="d-inline-block text-white ml-2">{user.win}</b>
									</Col>
								</Row>
								
								</Card.Body>
							</Card>						
						</Col>
						<Col className="col-5">
								<Card className="card-dark p-2" style={{height:'100%'}}>
									<h4 className="text-center" style={{color: `${user.coalition_color}`}}>Achievements</h4>
								</Card>
						</Col>
						<Col className="col-12 mt-4">
								<Card className="card-dark p-2">
									<h4 className="text-center" style={{color: `${user.coalition_color}`}}>Match History</h4>
								</Card>
						</Col>
					</Row>
				</Card.Body>
			</Card>
		</>
	)
}


export default Profile