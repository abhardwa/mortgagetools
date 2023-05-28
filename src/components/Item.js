import {Card, Button} from "react-bootstrap";

const Item = () => {
    return (
        <Card style={{ minWidth: '18rem', margin: '20px' }}>
        <Card.Img variant="top" src="..." />
        <Card.Body>
            <Card.Title>Example Card</Card.Title>
            <Card.Text>This is an example React card</Card.Text>
            <Button variant="primary">Example Button</Button>
        </Card.Body>
        </Card>
    );
};
export default Item;