import { createContext, useContext, useEffect, useState } from "react"
import {io } from 'socket.io-client'

const Context = createContext()

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || false)
	const [msgArr, setMsgArr] = useState([])
	const [factor, setFactor] = useState(false)
	
	const socket = io(`${process.env.REACT_APP_API_URL}`)
	
	
	useEffect(() => {
		socket.addEventListener(user.id, (data) => {
			const parsed = JSON.parse(data)
			setMsgArr([...msgArr, parsed])
		})
	}, [msgArr])
	
	useEffect(() => {
		socket.addEventListener('FEEDBACK', (msg) => {
			alert(msg)
		})
	}, [])

	const data = {
		user,
		setUser,
		socket,
		msgArr,
		setMsgArr,
		factor,
		setFactor
	}
	localStorage.setItem('user', JSON.stringify(user))
	return (
		<Context.Provider value={data}>
		{children}
		</Context.Provider>
	)
}

export const useAuth = () => useContext(Context)