import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fixed, setFixed] = useState(
    window.innerWidth > 576 ? "top" : "bottom"
  );

  useEffect(() => {
    const handleResize = () => {
      setFixed(window.innerWidth > 576 ? "top" : "bottom");
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <Navbar expand="md" variant="dark" fixed={fixed}>
      <Container>
        <Navbar.Brand
          as={Link}
          to="/home"
          className="text-light d-none d-sm-block"
        >
          Blockcraft Vault
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              My Assets
            </Nav.Link>
            <Nav.Link as={Link} to="/keypairs">
              Keychain
            </Nav.Link>
            <Nav.Link as={Link} to="/addresses">
              Address Book
            </Nav.Link>
            <Nav.Link as={Link} to="/add-entry">
              Send
            </Nav.Link>
            <Nav.Link as={Link} to="/receive">
              Receive
            </Nav.Link>
            <Nav.Link
              as={Link}
              onClick={() => {
                dispatch(logout());
                navigate("/");
              }}
            >
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
