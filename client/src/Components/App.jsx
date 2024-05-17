import { useEffect } from "react";
import Login from "./Login";
import { useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import Keypairs from "./Keypairs";
import { Routes, Route, useNavigate } from "react-router-dom";
import Addresses from "./Addresses";
import NavBar from "./NavBar";
import Assets from "./Assets";
import Receive from "./Receive";

function NotFound() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/");
  }, [navigate]);

  return null;
}

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <>
      {!isAuthenticated && <Login />}
      {isAuthenticated && (
        <>
          <NavBar />
          <Container className="mt-3 mt-4rem mb-mobile-6rem container-xl mw-375">
            <Routes>
              <Route path="/" element={<Assets />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/keypairs" element={<Keypairs />} />
              <Route path="/addresses" element={<Addresses />} />
              <Route path="/receive" element={<Receive />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Container>
        </>
      )}
    </>
  );
}

export default App;
