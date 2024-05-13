import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import {
  BsSafe,
  BsBoxArrowInDownRight,
  BsBoxArrowUpRight,
  BsPiggyBank,
  BsKey,
  BsPersonRolodex,
  BsPower,
} from "react-icons/bs";

function NavBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(
    window.innerWidth > 576 ? false : true
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth > 576 ? false : true);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {isMobile && (
        <Container className="d-flex align-items-center fs-5 mt-1">
          <BsSafe className="me-2 text-light" /> Blockcraft Vault
        </Container>
      )}
      <Navbar variant="dark" fixed={isMobile ? "bottom" : "top"}>
        <Container>
          {!isMobile && (
            <Navbar.Brand
              as={Link}
              to="/home"
              className="text-light d-none d-sm-block"
            >
              Blockcraft Vault
            </Navbar.Brand>
          )}
          <Nav
            className={`me-auto ${
              isMobile ? "w-100  d-flex justify-content-around" : ""
            }`}
          >
            <Nav.Link as={Link} to="/home">
              {isMobile ? (
                <div className="d-flex flex-column align-items-center text-light">
                  <BsPiggyBank size={30} />
                  <div className="fs-7 mt-1">Assets</div>
                </div>
              ) : (
                "Assets"
              )}
            </Nav.Link>
            <Nav.Link as={Link} to="/keypairs">
              {isMobile ? (
                <div className="d-flex flex-column align-items-center text-light">
                  <BsKey size={30} />
                  <div className="fs-7 mt-1">Keys</div>
                </div>
              ) : (
                "Keys"
              )}
            </Nav.Link>
            <Nav.Link as={Link} to="/addresses">
              {isMobile ? (
                <div className="d-flex flex-column align-items-center text-light">
                  <BsPersonRolodex size={30} />
                  <div className="fs-7 mt-1">Contacts</div>
                </div>
              ) : (
                "Contacts"
              )}
            </Nav.Link>
            <Nav.Link as={Link} to="/add-entry">
              {isMobile ? (
                <div className="d-flex flex-column align-items-center text-light">
                  <BsBoxArrowUpRight size={30} />
                  <div className="fs-7 mt-1">Send</div>
                </div>
              ) : (
                "Send"
              )}
            </Nav.Link>
            <Nav.Link as={Link} to="/receive">
              {isMobile ? (
                <div className="d-flex flex-column align-items-center text-light">
                  <BsBoxArrowInDownRight size={30} />
                  <div className="fs-7 mt-1">Receive</div>
                </div>
              ) : (
                "Receive"
              )}
            </Nav.Link>

            <Nav.Link
              as={Link}
              onClick={() => {
                dispatch(logout());
                navigate("/");
              }}
            >
              {" "}
              {isMobile ? (
                <div className="d-flex flex-column align-items-center text-light">
                  <BsPower size={30} />
                  <div className="fs-7 mt-1">Logout</div>
                </div>
              ) : (
                "Logout"
              )}
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavBar;
