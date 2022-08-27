import axios from "axios";

export default function handleGlobalUnload(){
	const jsonData = JSON.parse(localStorage.getItem('user'))
	axios.post(`${process.env.REACT_APP_API_URL}/user/set-status`, {
		id: jsonData.id,
		status: 0
	}).then(() => {})
}