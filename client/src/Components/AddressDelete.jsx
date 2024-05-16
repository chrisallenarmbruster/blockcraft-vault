import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { deleteAddress } from "../store/dataSlice";
import { BsTrash } from "react-icons/bs";
import PropTypes from "prop-types";

function AddressDelete({ address }) {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDelete = () => {
    dispatch(deleteAddress(address));
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
          Are you sure you want to delete the {`"${address.label}"`} contact?
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

AddressDelete.propTypes = {
  address: PropTypes.shape({
    nanoId: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }),
};

export default AddressDelete;
