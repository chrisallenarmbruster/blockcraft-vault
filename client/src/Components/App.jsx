import Login from "./Login";
import LogoutButton from "./LogoutButton";
import { useSelector } from "react-redux";
import { Container } from "react-bootstrap";

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return (
    <>
      {!isAuthenticated && <Login />}
      {isAuthenticated && (
        <Container>
          <h1>Logged in</h1>
          <LogoutButton />
        </Container>
      )}
    </>
  );
}

export default App;
