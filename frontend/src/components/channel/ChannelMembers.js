import { ListGroup, Button } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserEdit, faVolumeMute, faBan, faVolumeUp, faCheck } from '@fortawesome/free-solid-svg-icons'
import { Socket } from "socket.io-client";
import axios from 'axios'
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom'

export default function ChannelMembers({ myChannels, currentChannel }){
	const { user, socket } = useAuth()
	const navigate = useNavigate()

	const is_owner = () =>{
		for (let i = 0; i < myChannels[currentChannel].users.length; i++) {
			const channUser = myChannels[currentChannel].users[i];
			if (channUser.user_id === user.id && channUser.is_owner)
			{
				return true
			}
		}
		return false
	}

	const handleBan = (bannedId) => {
		const payload = {
			command:'ban_user',
			user_id: user.id,
			channel_name: myChannels[currentChannel].channel_name,
			param1:bannedId
		}
		socket.emit('ADMIN', JSON.stringify(payload))
		alert('User has been successfully banned')
	}

	const handleUnban = (bannedId) => {
		const payload = {
			command:'unban_user',
			user_id: user.id,
			channel_name: myChannels[currentChannel].channel_name,
			param1:bannedId
		}
		socket.emit('ADMIN', JSON.stringify(payload))
		alert('User has been successfully unbanned')
	}

	const handleAddOwner = (userId) => {
		const payload = {
			command:'add_admin',
			user_id: user.id,
			channel_name: myChannels[currentChannel].channel_name,
			param1:userId
		}
		socket.emit('ADMIN', JSON.stringify(payload))
		alert('User has been successfully authorized as admin')
	}

	const handleMute = (userId) => {
		const payload = {
			command:'mute_user',
			user_id: user.id,
			channel_name: myChannels[currentChannel].channel_name,
			param1:userId
		}
		socket.emit('ADMIN', JSON.stringify(payload))
		alert('User has been successfully muted')
	}

	const handleUnmute = (userId) => {
		const payload = {
			command:'unmute_user',
			user_id: user.id,
			channel_name: myChannels[currentChannel].channel_name,
			param1:userId
		}
		socket.emit('ADMIN', JSON.stringify(payload))
		alert('User has been successfully unmuted')
	}

	const handleProfile = (userId) => { console.log('user == ', userId); navigate(`/profile/${userId}`) }
	return (
		<>
			<h4 className="font-weight-light" >Member List</h4>
			<hr/>
			<ListGroup>
				{myChannels[currentChannel].users.map((myuser, index) => (
					<ListGroup.Item key={index}>
						<div>
							<b>{myuser.user_nick}</b>  {myuser.is_muted ? <FontAwesomeIcon icon={faVolumeMute} /> : ''}
							{myuser.user_id !== user.id ? <a onClick={() => handleProfile(myuser.user_id)} style={{cursor: 'pointer'}}  className="text-decoration-none text-primary"> Profile </a> : ''}
							
							{myuser.is_online &&  myuser.user_id !== user.id ?  <a style={{cursor: 'pointer'}}  className="text-decoration-none text-secondary"> Invite </a> : ''}
						</div>				
						<div className="mt-1">
						{is_owner() ?	( myuser.is_owner ?  '' : (
							<>
								<Button onClick={() => handleAddOwner(myuser.user_id)} style={{fontSize:'12px'}} variant="success"  > <FontAwesomeIcon icon={faUserEdit} /> </Button>
								<Button onClick={() => handleBan(myuser.user_id)}  style={{fontSize:'12px', marginLeft:'8px'}} variant="danger"  > <FontAwesomeIcon icon={faBan} /> </Button>
								{myuser.is_muted 
							? (	<Button onClick={() => handleUnmute(myuser.user_id)}  style={{fontSize:'12px', marginLeft: myuser.is_owner ? '' : '8px'}} variant="primary"  > <FontAwesomeIcon icon={faVolumeUp} /> </Button>)
							: ( <Button onClick={() => handleMute(myuser.user_id)} style={{fontSize:'12px', marginLeft: myuser.is_owner ? '' : '8px'}} variant="warning"  > <FontAwesomeIcon icon={faVolumeMute} /> </Button> )}	
							</>		
							)
						) : ""}													
						</div>					
					</ListGroup.Item>
				))}
			</ListGroup>
			<h4 className="font-weight-light mt-2" >Banned Users</h4>
			<ListGroup>
				{myChannels[currentChannel].banned_users.map((user, index) => (
					<ListGroup.Item key={index}>
						<b className="d-block">{user.user_nick}</b>
						{is_owner() ? (						
							<Button onClick={() => handleUnban(user.user_id)} style={{fontSize:'8px'}} variant="success"  > <FontAwesomeIcon icon={faCheck} /> </Button>
						) : ''}
					</ListGroup.Item>
				))}
			</ListGroup>
		</>
	)
	
}