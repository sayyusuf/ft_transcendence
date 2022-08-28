import {ListGroup } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'

export default function MyChannels({ myChannels }){
	const { user, socket } = useAuth()

	const handleEdit = ({ channel_name }) => {
		 
	}

	return (
		<>
			{myChannels.length > 0 ? (
			<>
				<h4>My Channels</h4>
				<ListGroup>
					{myChannels.map((chann, i) => (
						<ListGroup.Item key={i}>
							<div style={{
										whiteSpace: `nowrap`,
										overflow:`hidden`,
										textOverflow:`ellipsis`,																
									}}  >
									<b > {chann.channel_name}   </b> 								
								</div>
								<div className="d-flex justify-content-between">
									<a onClick={() => {}}  style={{cursor: 'pointer'}}  className="text-decoration-none"> Show </a>
									{ chann.owners.map((value) => {
											if (value === user.id)
												return (<a onClick={() => {handleEdit({ channel_name:chann.channel_name  })}}  style={{cursor: 'pointer'}}  className="text-decoration-none text-success"> Edit </a>)
										return ''
									})  }
									
									<a onClick={() => {}}  style={{cursor: 'pointer'}}  className="text-decoration-none text-danger"> Leave </a>

								
								 </div>	
						 </ListGroup.Item>
					))}
				</ListGroup>
				<hr />
			</>
		
		) : '' }
			
		</>
		
	)

}