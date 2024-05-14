import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { processCredentials } from "../store/cryptoMemStore";
import { login, logout, register } from "../store/authSlice";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  FloatingLabel,
} from "react-bootstrap";
import { BsSafe } from "react-icons/bs";

function Login() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [email, setEmail] = useState("chris@armbrustermail.com");
  const [password, setPassword] = useState("1234");
  const [confirmPassword, setConfirmPassword] = useState("1234");
  const [mode, setMode] = useState("login");
  const [isMobile, setIsMobile] = useState(
    window.innerWidth > 576 ? false : true
  );

  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth > 576 ? false : true);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (location.pathname !== "/") {
      navigate("/");
    }
  }, [location, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (mode === "register" && password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    await processCredentials(email, password);

    if (mode === "login") {
      dispatch(login());
    } else {
      dispatch(register());
    }
  };

  if (isAuthenticated) {
    return (
      <div>
        <p>Logged in</p>
        <button
          onClick={() => {
            setMode("login");
            dispatch(logout());
          }}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <Container className="d-flex flex-column justify-content-center vh-100">
      <Row className="justify-content-md-center">
        <Col xs md="6" lg="5" xl="4">
          <Container
            className={
              isMobile
                ? "justify-content-center"
                : "border border-2 px-2 rounded pb-3 my-3"
            }
          >
            <h1
              className={`${
                isMobile ? "display-4" : "h2"
              } mt-3 mb-1  d-flex align-items-center justify-content-center text-light fw-bold`}
            >
              <BsSafe className="me-2 text-light" /> Blockcraft Vault
            </h1>
            <h2
              className={`${
                isMobile ? "display-4" : "h2"
              } text-center mt-0 mb-4 text-light fw-bold`}
            >
              {mode === "login" ? "Login" : "Registration"}
            </h2>
            <Form onSubmit={handleSubmit}>
              <FloatingLabel
                controlId="floatingEmail"
                label="Email address"
                className="mb-3"
              >
                <Form.Control
                  type="email"
                  value={email}
                  placeholder="Enter email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  tabIndex={1}
                />
              </FloatingLabel>

              <FloatingLabel
                controlId="floatingPassword"
                label="Password"
                className="mb-3"
              >
                <Form.Control
                  type="password"
                  value={password}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  tabIndex={2}
                />
              </FloatingLabel>

              {mode === "register" && (
                <FloatingLabel
                  controlId="floatingConfirmPassword"
                  label="Confirm Password"
                  className="mb-3"
                >
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    placeholder="Confirm Password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    tabIndex={3}
                  />
                </FloatingLabel>
              )}
              <div className="d-flex justify-content-between w-100">
                <Button
                  variant="link"
                  type="button"
                  onClick={() =>
                    setMode(mode === "login" ? "register" : "login")
                  }
                  className="text-decoration-none"
                  tabIndex={5}
                >
                  {mode === "login" ? "Register Instead" : "Login Instead"}
                </Button>
                <Button variant="primary" type="submit" tabIndex={4}>
                  {mode === "login" ? "Login" : "Register"}
                </Button>
              </div>
            </Form>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
