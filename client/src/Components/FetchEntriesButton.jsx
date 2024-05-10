import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { fetchEntriesForAllKeys } from "../store/entriesSlice";

const FetchEntriesButton = () => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(fetchEntriesForAllKeys());
  };

  return <Button onClick={handleClick}>Fetch Entries for All Keys</Button>;
};

export default FetchEntriesButton;
