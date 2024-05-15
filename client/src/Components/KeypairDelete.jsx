import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteKeypair } from "../store/dataSlice";
import { BsTrash } from "react-icons/bs";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";

function KeypairDelete({ keypair }) {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDelete = () => {
    dispatch(deleteKeypair(keypair));
    handleClose();
  };

  return (
    <>
      <BsTrash className="cursor-pointer text-danger" onClick={handleShow} />

      <Modal
        centered
        show={show}
        onHide={handleClose}
        contentClassName="dark-modal"
      >
        <Modal.Header>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the {`"${keypair.label}"`} keypair?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

KeypairDelete.propTypes = {
  keypair: PropTypes.shape({
    nanoId: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }),
};

export default KeypairDelete;
