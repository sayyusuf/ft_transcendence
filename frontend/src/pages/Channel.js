import { Row, Col ,Button, Card } from 'react-bootstrap'
import ChannelList from '../components/channel/ChannelList'

export default function Channel(){
	return(
		<Card>
			<Card.Body>
				<Row>
					<Col className="col-2 border-dark" style={{
						borderRightWidth:'3px',
						borderRightColor:'black!important',		
					}}>
						<ChannelList/>
					</Col>
					<Col className="col-7">
						
					</Col>
					<Col className="col-3">
						
					</Col>
				</Row>
			</Card.Body>		
		</Card>
	)
}