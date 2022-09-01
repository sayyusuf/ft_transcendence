import { useEffect, useState } from 'react'
import { Row, Col ,Button, Card } from 'react-bootstrap'
import ChannelList from '../components/channel/ChannelList'
import { useAuth } from '../context/AuthContext'
import ChannelMembers from '../components/channel/ChannelMembers'
import ChannelChat from '../components/channel/ChannelChat'
import '../css/channel.css'

export default function Channel(){
	const { socket } = useAuth()
	const [currentChannel, setCurrentChannel] = useState(-1)
	const [myChannels, setMyChannels] = useState([])
	const [channMsgArr, setChannMsgArr] = useState([])

	console.log(myChannels)
	return(
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
						<ChannelChat myChannels={myChannels} setMyChannels={setMyChannels} currentChannel={currentChannel} channMsgArr={channMsgArr} setChannMsgArr={setChannMsgArr}/>
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
	)
}