import { createContext, useContext, useState } from "react"
import {io } from 'socket.io-client'

const Context = createContext()

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || false)

	const socket = io(`${process.env.REACT_APP_API_URL}`)
	const data = {
		user,
		setUser,
		socket,
	}
	localStorage.setItem('user', JSON.stringify(user))

	return (
		<Context.Provider value={data}>
		{children}
		</Context.Provider>
	)
}

export const useAuth = () => useContext(Context)