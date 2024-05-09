import Login from "./Login";
import LogoutButton from "./LogoutButton";
import { useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import KeypairAdd from "./KeypairAdd";
import KeypairDelete from "./KeypairDelete";
import KeypairUpdate from "./KeypairUpdate";
import Keypairs from "./Keypairs";
import { Routes, Route } from "react-router-dom";

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return (
    <>
      {!isAuthenticated && <Login />}
      {isAuthenticated && (
        <Container>
          <h1>Logged in</h1>
          <LogoutButton />
          {/* <Keypairs /> */}
          {/* <KeypairAdd /> */}
          {/* <KeypairDelete /> */}
          {/* <KeypairUpdate /> */}
          <Routes>
            <Route path="/" element={<Keypairs />} />
            <Route path="/keypairs" element={<Keypairs />} />
            <Route path="/add-keypair" element={<KeypairAdd />} />
            {/* <Route path="/delete-keypair" element={<KeypairDelete />} /> */}
            <Route path="/update-keypair" element={<KeypairUpdate />} />
          </Routes>
        </Container>
      )}
    </>
  );
}

export default App;
