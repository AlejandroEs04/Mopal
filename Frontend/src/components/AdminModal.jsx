import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function AdminModal({show, onHide, header, children}) {
    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            arial-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header
                closeButton
            >
                {header}
            </Modal.Header>

            <Modal.Body>
                {children}
            </Modal.Body>

            <Modal.Footer>
                <Button onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AdminModal