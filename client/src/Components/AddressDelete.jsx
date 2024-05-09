import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { deleteAddress } from "../store/dataSlice";
import PropTypes from "prop-types";

function AddressDelete({ address }) {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(deleteAddress(address));
  };

  return (
    <Button variant="danger" onClick={handleClick}>
      Delete
    </Button>
  );
}

AddressDelete.propTypes = {
  address: PropTypes.shape({
    nanoId: PropTypes.string.isRequired,
  }),
};

export default AddressDelete;
