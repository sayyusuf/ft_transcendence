import { useEffect, useState } from 'react'
import { Row, Col ,Button, Card } from 'react-bootstrap'
import ChannelList from '../components/channel/ChannelList'
import { useAuth } from '../context/AuthContext'
import ChannelMembers from '../components/channel/ChannelMembers'
import ChannelChat from '../components/channel/ChannelChat'
import '../css/channel.css'

export default function Channel(){
	const { socket } = useAuth()
	const [currentChannel, setCurrentChannel] = useState({})

	useEffect(() => {
		socket.on('FEEDBACK', (msg) => {
			alert(msg)
		})
	}, [])

	return(
		<Card>
			<Card.Body id="channel-card">
				<Row className="border-between">
					<Col  className="col-2 channel-col" style={{
						borderRight: "1px solid #ccc"
					}}>
						<ChannelList setCurrentChannel={setCurrentChannel}  />
					</Col>
					<Col className="col-7">
						<ChannelChat />
					</Col>
					<Col className="col-3" style={{
						borderLeft: "1px solid #ccc"
					}}>
						<ChannelMembers />
					</Col>
				</Row>
			</Card.Body>		
		</Card>
	)
}