import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { deleteKeypair } from "../store/dataSlice";
import PropTypes from "prop-types";

function KeypairDelete({ keypair }) {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(deleteKeypair(keypair));
  };

  return (
    <Button variant="danger" onClick={handleClick}>
      Delete
    </Button>
  );
}

KeypairDelete.propTypes = {
  keypair: PropTypes.shape({
    nanoId: PropTypes.string.isRequired,
    // ... other properties
  }),
};

export default KeypairDelete;
