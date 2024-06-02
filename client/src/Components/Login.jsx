import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { processCredentials } from "../store/cryptoMemStore";
import {
  login,
  register as registerThunk,
  resetError,
} from "../store/authSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Form, Button, Container, Row, Col, Modal } from "react-bootstrap";
import { BsSafe } from "react-icons/bs";

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
  confirmPassword: yup.string(),
});

function Login() {
  const isError = useSelector((state) => state.auth.error);

  const [mode, setMode] = useState("login");
  const [isMobile, setIsMobile] = useState(
    window.innerWidth > 576 ? false : true
  );
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

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

  const onSubmit = async (data) => {
    const { email, password, confirmPassword } = data;

    if (mode === "register" && password !== confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

    try {
      await processCredentials(email, password);

      if (mode === "login") {
        dispatch(login());
      } else {
        dispatch(registerThunk());
      }
    } catch (error) {
      console.error(error);
    }
  };

  return !isError ? (
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

            <Form onSubmit={handleSubmit(onSubmit)} className="px-2">
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="text"
                  name="email"
                  placeholder={mode === "login" ? 'try "demo@email.com"' : ""}
                  {...register("email")}
                  isInvalid={!!errors.email}
                  tabIndex={1}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder={mode === "login" ? 'try "demo"' : ""}
                  {...register("password")}
                  required
                  tabIndex={2}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password?.message}
                </Form.Control.Feedback>
              </Form.Group>

              {mode === "register" && (
                <Form.Group className="mb-3" controlId="confirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder=""
                    {...register("confirmPassword")}
                    isInvalid={!!errors.confirmPassword}
                    required
                    tabIndex={3}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword?.message}
                  </Form.Control.Feedback>
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
  ) : (
    <Modal
      show={isError}
      onHide={() => dispatch(resetError())}
      centered
      contentClassName="dark-modal"
    >
      <Modal.Header>
        <Modal.Title>
          {mode === "login" ? "Login" : "Registration"} Error
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="my-3 text-center">{isError.comment}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="danger"
          onClick={() => dispatch(resetError())}
          tabIndex={1}
        >
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Login;
