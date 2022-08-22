import axios from "axios"
import { useState } from "react"
import { Button, Form } from "react-bootstrap"
import { Navigate, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function PrivateRoute({children}){
	// kullanici oturum acmis mi
	const navigate = useNavigate()
	const [factor, setFactor] = useState(false)

	const { user } = useAuth()
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