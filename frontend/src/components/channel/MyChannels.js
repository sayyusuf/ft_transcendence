import {ListGroup } from 'react-bootstrap'

export default function MyChannels({ myChannels }){
	return (
		<>
			{myChannels.length > 0 ? (
			<>
				<h4>My Channels</h4>
				<ListGroup>
					{myChannels.map((chann, i) => (
						<ListGroup.Item key={i}> <b> {chann.channel_name}  </b> </ListGroup.Item>
					))}
				</ListGroup>
			</>
		
		) : '' }
			<hr />
		</>
		
	)

}