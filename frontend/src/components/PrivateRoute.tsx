import axios from "axios"
import { useEffect, useState } from "react"
import { Button, Form } from "react-bootstrap"
import { Navigate, useNavigate } from "react-router-dom"
import { Socket } from "socket.io-client"
import { useAuth } from "../context/AuthContext"

export default function PrivateRoute({children}){
	// kullanici oturum acmis mi
	const navigate = useNavigate()

	const { user, factor, setFactor } = useAuth()
	if (!user){
		return (
			<Navigate to="/login" />
		)
	}


	if (user.two_factor_enabled && !factor){
		console.log('test')
		const handleVerify = () => {
			axios.post(`${process.env.REACT_APP_API_URL}/user/verify`, {
				id: user.id,
				token: document.getElementById('factor').value
			}).then(res => {
				if (!res.data){
					alert('Verification failed')
					return;
				}
				setFactor(true)
			})
		}

		return (
			<>
				<Form.Group>
					<Form.Label>Enter Authantication Code</Form.Label>
					<Form.Control id="factor"  type="number" style={{width:'30%'}}/>
				</Form.Group>
				<Button onClick={handleVerify} className="mt-2" variant="primary">Verify</Button>
			</>
			
		)
	}
	return children

}

export function PrivateGameRoute({children}){
	
	const { user, factor, setFactor } = useAuth()
	if (!user){
		return (
			<Navigate to="/login" />
		)
	}
	if (user.two_factor_enabled && !factor){
		const handleVerify = () => {
			axios.post(`${process.env.REACT_APP_API_URL}/user/verify`, {
				id: user.id,
				token: document.getElementById('factor').value
			}).then(res => {
				if (!res.data){
					alert('Verification failed')
					return;
				}
				setFactor(true)
			})
		}

		return (
			<>
				<Form.Group>
					<Form.Label>Enter Authantication Code</Form.Label>
					<Form.Control id="factor"  type="number" style={{width:'30%'}}/>
				</Form.Group>
				<Button onClick={handleVerify} className="mt-2" variant="primary">Verify</Button>
			</>
			
		)
	}

	// console.log("testttt");
	// socket.emit('already_in', user.id)

	// socket.on('already_in_status', (data) => {
	// 	const parsed = JSON.parse(data)
	// 	if (parsed.status == true){
	// 		setGame(true)
	// 	}	
	// })
	// if (game){
	// 	console.log('nav girdi')
	// 	return <Navigate to="/" />
	// }
	// console.log('children renderlandi')
	return children
}