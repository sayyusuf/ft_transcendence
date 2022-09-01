import { useEffect, useState } from 'react'
import { Row, Col ,Button, Card, Modal } from 'react-bootstrap'
import ChannelList from '../components/channel/ChannelList'
import { useAuth } from '../context/AuthContext'
import ChannelMembers from '../components/channel/ChannelMembers'
import ChannelChat from '../components/channel/ChannelChat'
import '../css/channel.css'
import { useNavigate } from 'react-router'

export default function Channel(){
	const { socket, user } = useAuth()
	const [currentChannel, setCurrentChannel] = useState(-1)
	const [myChannels, setMyChannels] = useState([])
	const [opponent, setOpponent] = useState({})
	const navigate = useNavigate()
	const [showOpponentInvite, setOpponentInvite] = useState(false);
	const handleCloseOpponentInvite = () => setOpponentInvite(false);
	const handleShowOpponentInvite = () => setOpponentInvite(true);

	const handleAcceptInvite = () => {
		const payload = {
			command:'accept_invite',
			user_id: user.id,
			param1:opponent.opponent_id,
			channel_name: opponent.channel_name
		}
		socket.emit('ADMIN', JSON.stringify(payload))
	}

	useEffect(() => {
		socket.addEventListener('INVITE_RES', (data) => {
			if (data){
				console.log('helloo')
				navigate('/game')
			}
			// else{
			// 	handleCloseInvite()
			// }
		})

		socket.addEventListener('GET_INVITE', (data) => {
			const parsed = JSON.parse(data)
			setOpponent({ opponent_id: parsed.user_id, opponent_nick: parsed.user_nick, channel_name: parsed.channel_name })
			handleShowOpponentInvite(true)
		})
	}, [])
	return(
		<>
			<Card>
				<Card.Body id="channel-card">
					<Row className="border-between">
						<Col  className="col-2 channel-col" style={{
							borderRight: "1px solid #ccc",
							overflowY:'auto'
						}}>
							<ChannelList  myChannels={myChannels} setMyChannels={setMyChannels} currentChannel={currentChannel}  setCurrentChannel={setCurrentChannel}  />
						</Col>
						<Col className="col-7" style={{overflowY:'auto'}}>
							{myChannels[currentChannel] === undefined ? '' : (
								<ChannelChat myChannels={myChannels} setMyChannels={setMyChannels} currentChannel={currentChannel}/>
							)}				
						</Col>
						<Col className="col-3" style={{
							borderLeft: "1px solid #ccc",
							overflowY:'auto'
						}}>
							{myChannels[currentChannel] === undefined ? '' : (
								<ChannelMembers myChannels={myChannels} currentChannel={currentChannel}  />
							)}				
						</Col>
					</Row>
				</Card.Body>		
			</Card>


			<Modal show={showOpponentInvite} onHide={handleCloseOpponentInvite}>
			<Modal.Header closeButton>
				<Modal.Title>Game Invitation</Modal.Title>
			</Modal.Header>
			<Modal.Body>
					{opponent.opponent_nick} invites you to a game
			</Modal.Body>
			<Modal.Footer>
				<Button variant="danger" onClick={handleCloseOpponentInvite}>
					Reject
				</Button>
				<Button variant="success" onClick={handleAcceptInvite}>
					Accept
				</Button>
			</Modal.Footer>
			</Modal>
		</>
		
	)
}