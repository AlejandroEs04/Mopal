import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ModalSalesForm from './ModalSalesForm';

const CenterModalContainer = (props) => {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.modalInfo.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <>
                    {props.modalInfo.type === 1 && <ModalSalesForm />}
                </>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='danger' onClick={props.onHide}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CenterModalContainer