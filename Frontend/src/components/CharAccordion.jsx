import Accordion from 'react-bootstrap/Accordion';

const CharAccordion = ({items}) => {
  return (
    <Accordion defaultActiveKey={"0"}>
        {items?.map(item => (
            <Accordion.Item eventKey={item.ID}>
                <Accordion.Header>{item.header}</Accordion.Header>
                <Accordion.Body>
                    {item.body}
                </Accordion.Body>
            </Accordion.Item>
        ))}
    </Accordion>
  )
}

export default CharAccordion