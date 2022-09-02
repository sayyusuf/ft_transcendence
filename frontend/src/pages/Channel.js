import { useEffect, useState } from 'react'
import { Row, Col ,Button, Card, Modal } from 'react-bootstrap'
import ChannelList from '../components/channel/ChannelList'
import { useAuth } from '../context/AuthContext'
import ChannelMembers from '../components/channel/ChannelMembers'
import ChannelChat from '../components/channel/ChannelChat'
import '../css/channel.css'
import { useNavigate } from 'react-router'

export default function Channel({ showInvite, setShowInvite }){
	const [currentChannel, setCurrentChannel] = useState(-1)
	const [myChannels, setMyChannels] = useState([])



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
								<ChannelMembers showInvite={showInvite}  setShowInvite={setShowInvite}  myChannels={myChannels} currentChannel={currentChannel}  />
							)}				
						</Col>
					</Row>
				</Card.Body>		
			</Card>

		</>
		
	)
}