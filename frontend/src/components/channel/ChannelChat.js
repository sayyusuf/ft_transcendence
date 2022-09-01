import { Row, Col, Button, Form } from 'react-bootstrap'

export default function ChannelChat(){
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
							<li><b>eharuni: </b> Selam</li>
							<li>Selam</li>
							<li>Selam</li>
							<li>Selam</li>
							<li>Selam</li>
							<li>Selam</li>
							<li>Selam</li>

						</ul>
					</div>
					<div>
						<Row>
							<Col className="col-10">
								<Form.Control  id="msg-input" autoComplete="off" />
							</Col>
							<Col className="col-2">
								<Button variant="primary" onClick={() => {}}  id="submit-btn">Send</Button>
							</Col>
						</Row>					
					</div>
				</div>
		</>
	)
}