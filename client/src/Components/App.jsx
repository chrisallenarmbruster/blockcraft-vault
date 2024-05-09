import Login from "./Login";
import LogoutButton from "./LogoutButton";
import { useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import KeypairAdd from "./KeypairAdd";
import KeypairDelete from "./KeypairDelete";

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return (
    <>
      {!isAuthenticated && <Login />}
      {isAuthenticated && (
        <Container>
          <h1>Logged in</h1>
          <LogoutButton />
          <KeypairAdd />
          <KeypairDelete />
        </Container>
      )}
    </>
  );
}

export default App;
