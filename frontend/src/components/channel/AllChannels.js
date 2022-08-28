import {ListGroup } from 'react-bootstrap'

export default function AllChannels({ allChannels }){


	return (
		<>
			{allChannels.length > 0 ? (
			<>
				<h4>All Channels</h4>
				<ListGroup>
					{allChannels.map((chann, i) => (
						<ListGroup.Item key={i}> <b> {chann.channel_name}  </b> </ListGroup.Item>
					))}
				</ListGroup>
			</>
		
		) : '' }
		</>
		
	)
	
}