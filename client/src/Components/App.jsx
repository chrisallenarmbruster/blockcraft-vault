import Login from "./Login";
import LogoutButton from "./LogoutButton";
import { useSelector } from "react-redux";
import { Container, Button } from "react-bootstrap";
import KeypairAdd from "./KeypairAdd";
import KeypairUpdate from "./KeypairUpdate";
import Keypairs from "./Keypairs";
import { Routes, Route } from "react-router-dom";
import Addresses from "./Addresses";
import AddressAdd from "./AddressAdd";
import AddressUpdate from "./AddressUpdate";
import { useNavigate } from "react-router-dom";
import FetchEntriesButton from "./FetchEntriesButton";
import EntryAdd from "./EntryAdd";

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  return (
    <>
      {!isAuthenticated && <Login />}
      {isAuthenticated && (
        <Container>
          <h1>Logged in</h1>
          <LogoutButton />
          <FetchEntriesButton />
          <Button variant="primary" onClick={() => navigate("/addresses")}>
            Address Book
          </Button>{" "}
          <Button variant="primary" onClick={() => navigate("/keypairs")}>
            Keychain
          </Button>
          <Button variant="primary" onClick={() => navigate("/add-entry")}>
            Add Entry
          </Button>
          <Routes>
            <Route path="/" element={<Keypairs />} />
            <Route path="/keypairs" element={<Keypairs />} />
            <Route path="/add-keypair" element={<KeypairAdd />} />
            <Route path="/update-keypair" element={<KeypairUpdate />} />
            <Route path="/addresses" element={<Addresses />} />
            <Route path="/add-address" element={<AddressAdd />} />
            <Route path="/update-address" element={<AddressUpdate />} />
            <Route path="/add-entry" element={<EntryAdd />} />
          </Routes>
        </Container>
      )}
    </>
  );
}

export default App;
