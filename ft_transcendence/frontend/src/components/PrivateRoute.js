import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function PrivateRoute({children}){
	// kullanici oturum acmis mi

	const { user } = useAuth()
	if (!user)
		return (
			<Navigate to="/login" />
		)

	// eger acmamissa yonlendirme
	// eger acmissa childreni render et

	return children

}