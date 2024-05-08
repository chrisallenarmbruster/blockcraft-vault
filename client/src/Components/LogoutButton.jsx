import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

const LogoutButton = () => {
  const dispatch = useDispatch();

  return <Button onClick={() => dispatch(logout())}>Logout</Button>;
};

export default LogoutButton;
