import { useState } from 'react'
import { Row, Col, Button, Form } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'

export default function ChannelChat({ channMsgArr, setChannMsgArr, myChannels, currentChannel }){
	const { user, socket } = useAuth()
	const [msg, setMsg] = useState('')

	const handleSend = () => {
		const payload = {
			target: myChannels[currentChannel].channel_id,
			sender: user.id,
			msg: msg
		}
		socket.emit('PRIV', JSON.stringify(payload))
	}

	return (
		<>
			<div id="chat-div" style={{
					display:'flex',
					flexDirection:'column',
					justifyContent:"space-between",
					height:'100%'
				}}>
					<div>
						<ul id="messages">
							
						</ul>
					</div>
					<div>
						<Row>
							<Col className="col-10">
								<Form.Control value={msg} onChange={(e) => setMsg(e.target.value)} id="msg-input" autoComplete="off" />
							</Col>
							<Col className="col-2">
								<Button variant="primary" onClick={handleSend}  id="submit-btn">Send</Button>
							</Col>
						</Row>					
					</div>
				</div>
		</>
	)
}