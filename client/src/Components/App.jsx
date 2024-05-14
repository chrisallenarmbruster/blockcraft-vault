import { useEffect } from "react";
import Login from "./Login";
import { useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import KeypairAdd from "./KeypairAdd";
import KeypairUpdate from "./KeypairUpdate";
import Keypairs from "./Keypairs";
import { Routes, Route, useNavigate } from "react-router-dom";
import Addresses from "./Addresses";
import AddressAdd from "./AddressAdd";
import AddressUpdate from "./AddressUpdate";
import EntryAdd from "./EntryAdd";
import NavBar from "./NavBar";
import Assets from "./Assets";

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
          <Container className="mt-1 mt-md-5">
            <Routes>
              <Route path="/" element={<Assets />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/keypairs" element={<Keypairs />} />
              <Route path="/add-keypair" element={<KeypairAdd />} />
              <Route path="/update-keypair" element={<KeypairUpdate />} />
              <Route path="/addresses" element={<Addresses />} />
              <Route path="/add-address" element={<AddressAdd />} />
              <Route path="/update-address" element={<AddressUpdate />} />
              <Route path="/add-entry" element={<EntryAdd />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Container>
        </>
      )}
    </>
  );
}

export default App;
