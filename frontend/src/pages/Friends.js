import { Row, Button, Card, Col, Modal, Form, ListGroup, ListGroupItem } from "react-bootstrap"
import { useEffect, useState } from 'react'
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Friends = () => {
	const [show, setShow] = useState(false);
	const [addNick, setNick] = useState('')
	const { user, setAuth } = useAuth()
	const [friendArray, setFriendArray] = useState([])
	const [blockArray, setBlockArray] = useState([])
	const [refresh, setRefresh] = useState(false)

  	const handleClose = () => setShow(false);
  	const handleShow = () => setShow(true);

	const handleAddFriend = () => {
		const payload = {
			id: user.id,
			nick: addNick
		}

		axios.post(`${process.env.REACT_APP_API_URL}/user/add-friend`, payload)
		.then((response) => {
			alert(`${response.data.nick} added as a friend`)
		})
		.catch(() => {
			alert(`User with nickname: ${addNick} is not found`)
		})
	}

	const handleBlock = (nick) => {
		const payload = {
			id: user.id,
			nick: nick
		}

		axios.post(`${process.env.REACT_APP_API_URL}/user/block-friend`, payload)
		.then((response) => {
			alert(`${response.data.nick} blocked`)
		})
		.catch(() => {
			alert(`User with nickname: ${addNick} couldnt be blocked`)
		})
	}

	const handleRemoveBlock = (nick) => {
		const payload = {
			id: user.id,
			nick: nick
		}
		axios.post(`${process.env.REACT_APP_API_URL}/user/remove-block`, payload)
		.then((response) => {
			alert(`${response.data.nick} is unblocked`)
		})
		.catch(() => {
			alert(`User with nickname: ${addNick}  couldnt be unblocked`)
		})
	}

	useEffect(() => {
		const payload = {
			id: user.id
		}
		axios.post(`${process.env.REACT_APP_API_URL}/user/get-friends`, payload)
		.then(res => {
			const friends = res.data
			setFriendArray(friends)
		})
		.catch(() => console.log('error'))

		axios.post(`${process.env.REACT_APP_API_URL}/user/get-blocks`, payload)
		.then(res => {
			const blocks = res.data
			setBlockArray(blocks)
		})
		.catch(() => console.log('error'))
	}, [friendArray, blockArray, refresh])

	
	

	return (
		<>

		<Button variant="primary" className="mb-2" onClick={handleShow}>Add Friend</Button>
		<Row>
			<Col md={6}>
				<Card>
					<Card.Title>
						<h3 className="text-center">Friends</h3>
						<hr />
					</Card.Title>
					<Card.Body className="mt-0">
						<ListGroup>
						{friendArray.map((friend, index) => (
							<ListGroupItem>
								<div className="d-flex justify-content-between">
									<div>
									{friend.name} {friend.surname} - {friend.nick}
									</div>
									<Button onClick={() => handleBlock(friend.nick)} variant="danger">Block</Button>
								</div>						
							</ListGroupItem>
						))}
						</ListGroup>

					
					</Card.Body>
				</Card>
			</Col>
			<Col md={6}>
				<Card>
					<Card.Title>
						<h3 className="text-center">Blocked Users</h3>
						<hr />
					</Card.Title>
					<Card.Body>
						<ListGroup>
							{blockArray.map((block, index) => (
								<ListGroupItem>
									<div className="d-flex justify-content-between">
										<div>
										{block.name} {block.surname} - {block.nick}
										</div>
										<Button onClick={() => handleRemoveBlock(block.nick)} variant="success">Unblock</Button>
									</div>	
								</ListGroupItem>
							))}
							</ListGroup>
					</Card.Body>
				</Card>
			</Col>
		</Row>

		<Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Friend</Modal.Title>
        </Modal.Header>
        <Modal.Body>
			<Form.Control onChange={(e) => setNick(e.target.value)} type="text"></Form.Control>
			<Button onClick={handleAddFriend} className="mt-2" variant="success">Add</Button>
		</Modal.Body>
      </Modal>
		</>
	)
}

export default Friends