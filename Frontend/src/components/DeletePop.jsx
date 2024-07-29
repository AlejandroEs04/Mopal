import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const DeletePop = ({setShow, show, setFolio, text, handleFunction, header = "Eliminar Producto", btnGreen = false, btnText = "Eliminar"}) => {
    const handleClose = () => {
        setShow(false)
        setFolio('')
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{header}</Modal.Title>
            </Modal.Header>

            <Modal.Body>{text}</Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant={btnGreen ? "success" : "danger"} onClick={() => {
                    handleFunction()
                    handleClose()
                }}>
                    {btnText}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default DeletePop