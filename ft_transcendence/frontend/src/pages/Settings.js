import axios from "axios"
import { useState } from "react"
import { Row, Col, Form, Button, Modal } from "react-bootstrap"
import { useAuth } from "../context/AuthContext"


export default function Settings() {
	const { user, setUser } = useAuth()
	const [nickname, setNickname] = useState(user.nick)
	const [show, setShow] = useState(false);
	const [changeSuccess, setChangeSuccess] = useState(false);
	const [avatarValue, setAvatarValue] = useState('')
	const handleClose = () => setShow(false);
  	const handleShow = () => setShow(true);

	const changeNicknameHandle = () => {
		const data = {
			nick: nickname,
			id: user.id
		}
		axios.post(`${process.env.REACT_APP_API_URL}/user/change-nickname`, data)
		.then(response => {
			user.nick = response.data.nick
			setChangeSuccess(true)
			setUser(user)
			handleShow()
		})
		.catch(error => {
			
		})
	}

	const ModalContent = () => {
		if (changeSuccess)
			return (
				<>
					<Modal.Header closeButton>
						<Modal.Title>Success</Modal.Title>
						</Modal.Header>
						<Modal.Body>Nickname has been changed successfully</Modal.Body>
						<Modal.Footer>
							<Button variant="secondary" onClick={handleClose}>
								Close
							</Button>				
					</Modal.Footer>
				</>
				
			)
		else
			return (
				<>
					<Modal.Header closeButton>
						<Modal.Title>Error</Modal.Title>
						</Modal.Header>
						<Modal.Body>Nickname is already taken</Modal.Body>
						<Modal.Footer>
							<Button variant="secondary" onClick={handleClose}>
								Close
							</Button>				
					</Modal.Footer>
				</>
			)
	}

	let isValid = true
	if (nickname.length === 0 || nickname === user.nick)
		isValid = false

	let isAvatarValid = true
	if (avatarValue.length == 0)
		isAvatarValid = false

	const changeAvatarHandle = () => {
		const url = `${process.env.REACT_APP_API_URL}/user/change-avatar`;
		console.log(avatarValue.file.name)
		const postedFile = avatarValue.file
		const filename = postedFile.name
		const newFileName = user.login + filename.substring(filename.lastIndexOf('.'), filename.length) || filename;
		const willBeUploadedFile = new File([postedFile], newFileName)


		const formData = new FormData()
		formData.append('file', willBeUploadedFile)
		formData.append('id', user.id)
		const config = {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		}
		axios.post(url,  formData, config).then(respone => {
			user.avatar = `${process.env.REACT_APP_API_URL}/${user.login}.jpg`
			setUser(user)
		})
	}
	
	return (
		<>
			<Row>
				<Col className="col-8">
				<Form.Group className="mb-3" controlId="formBasicEmail">
					<Form.Label>Nickname</Form.Label>
					<Form.Control type="text" onChange={e => setNickname(e.target.value)} value={nickname} placeholder="Enter nickname" />
				</Form.Group>
				</Col>
				<Col className="col-4">
					<Button disabled={!isValid} onClick={changeNicknameHandle} style={{marginTop: '30px'}} variant="success">
						Change Nickname
					</Button>
				</Col>

				<Col className="col-8">
					<Form.Group onChange={e => setAvatarValue({file:e.target.files[0]})} value={avatarValue} controlId="formFile" className="mb-3">
						<Form.Label>Default file input example</Form.Label>
						<Form.Control type="file" accept=".jpg" />
					</Form.Group>
				</Col>
				<Col className="col-4">
					<Button disabled={!isAvatarValid} onClick={changeAvatarHandle} style={{marginTop: '30px'}} variant="success">
						Change Avatar
					</Button>
				</Col>
			</Row>




			<Modal show={show} onHide={handleClose}>
				<ModalContent />
			</Modal>
		</>
		
	)
}