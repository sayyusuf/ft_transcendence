import { createContext, useContext, useEffect, useState } from "react"


const Context = createContext(null)

export const AuthProvider = ({ children, socket }) => {
	const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || false)
	const [msgArr, setMsgArr] = useState([])
	const [factor, setFactor] = useState(false)
	console.log('context yenilendi')
	
	
	useEffect(() => {
		socket.on(user.id, (data) => {
			const parsed = JSON.parse(data)
			setMsgArr([...msgArr, parsed])
		})
		socket.on('hello', msg => console.log(msg))
	}, [msgArr])
	
	useEffect(() => {
		socket.on('FEEDBACK', (msg) => {
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