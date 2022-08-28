import { Row, Col ,Button, Card } from 'react-bootstrap'
import ChannelList from '../components/channel/ChannelList'

export default function Channel(){
	return(
		<Card>
			<Card.Body>
				<Row className="border-between">
					<Col className="col-2" style={{
						borderRight: "1px solid #ccc"
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