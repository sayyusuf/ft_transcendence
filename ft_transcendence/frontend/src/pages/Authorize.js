import { Navigate, useNavigate } from "react-router-dom"
import axios from 'axios'
import { useAuth } from "../context/AuthContext"
import { useEffect } from "react"

const Authorize = () => {
	const searchParams = new URLSearchParams(document.location.search)
	console.log(searchParams)
	const code = searchParams.get('code')
	const navigate = useNavigate()
	const {setUser} = useAuth()
	if (!code)
		<Navigate to="/login" />
	
	useEffect(() => {
		const url = `${process.env.REACT_APP_API_URL}/user/auth?code=${code}`
		const fetchData = async () => {
			const response = await axios.get(url).catch(() => setUser(false))
			setUser(response.data)
		}
		fetchData()
	}, [])
	return (
		<Navigate to="/" />
	)
}

export default Authorize