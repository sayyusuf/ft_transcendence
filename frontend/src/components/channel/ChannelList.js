import { Row, Col ,Button, Form, Modal, ListGroup } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import AllChannels from './AllChannels';
import MyChannels from './MyChannels';

export default function ChannelList(){
	const {user, socket} = useAuth()
	const [show, setShow] = useState(false);
	const [showPass, setShowPass] = useState(false)
	const [myChannels, setMyChannels] = useState([])
	const [allChannels, setAllChannels] = useState([])

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const send = {
		user_id:user.id
	}	
	socket.addEventListener('GET_ALL', (data) => {
		const parsed = JSON.parse(data)
		setMyChannels(parsed.my_channels)
		setAllChannels(parsed.all_channels)
	})
	useEffect(() => {
		socket.emit('ONLINE', JSON.stringify(send) )
	}, [])
	
	const handleCreateChannel = () => {
		const chann_name = document.getElementById('formChannelName').value
		const type = document.getElementById('formChannelType').value
		let pass = null
		let status = 2
		if (type === 'private')
			status = 0
		else if (type === 'protected')
			status = 1
		if (status !== 2)
			pass = document.getElementById('formChannelPassword').value
		const data = {
			user_id: user.id,
			user_nick: user.nick,
			channel_name: chann_name,
			status: status,
			password: pass
		}
		socket.emit('CHAN', JSON.stringify(data))
	}

	console.log(myChannels)
	console.log(allChannels)
	

	return (		
		<>
			<Row>
				<Col className="col-12">
					<Button onClick={handleShow} style={{marginLeft:'16px'}}  variant="primary">Create Channel</Button>
					<hr/>
				</Col>
				<Col className="col-12">
					<MyChannels myChannels={myChannels} />
					<AllChannels allChannels={allChannels} />
				</Col>
			</Row>

			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
				<Modal.Title>Add Channel</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form.Group className="mb-3" controlId="formChannelName">
						<Form.Label>Channel Name</Form.Label>
						<Form.Control type="text" placeholder="Enter channel name" />
					</Form.Group>
					<Form.Group className="mb-3" controlId="formChannelType">
							<Form.Label>Channel Type</Form.Label>
							<Form.Select onChange={(e) =>  e.target.value !== 'public' ? setShowPass(true) : setShowPass(false)}>
								<option value="public">Public</option>
								<option value="private">Private</option>
								<option value="protected">Protected</option>
							</Form.Select>
					</Form.Group>
					<Form.Group controlId="formChannelPassword">
						{showPass ? (
							<>
								<Form.Label>Channel Password</Form.Label>
								<Form.Control type="text"></Form.Control>
							</>					
						) : ''}
						
					</Form.Group>
				</Modal.Body>
				<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>
					Close
				</Button>
				<Button variant="primary" onClick={handleCreateChannel}>
					Create
				</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}