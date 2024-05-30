import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { processCredentials } from "../store/cryptoMemStore";
import { login, logout, register } from "../store/authSlice";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { BsSafe } from "react-icons/bs";

function Login() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    <Container className="d-flex flex-column justify-content-center vh-100 mw-375">
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
              } text-center mt-0 mb-5 text-secondary fw-bold`}
            >
              {mode === "login" ? "Login" : "Registration"}
            </h2>
            <Form onSubmit={handleSubmit} className="px-2">
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  placeholder={mode === "login" ? 'try "demo@email.com"' : ""}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  tabIndex={1}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  placeholder={mode === "login" ? 'try "demo"' : ""}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  tabIndex={2}
                />
              </Form.Group>

              {mode === "register" && (
                <Form.Group className="mb-3" controlId="confirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    placeholder=""
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    tabIndex={3}
                  />
                </Form.Group>
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
