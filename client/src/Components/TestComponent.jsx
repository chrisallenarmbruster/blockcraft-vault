import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { processCredentials } from "../store/cryptoMemStore";
import { login, logout, register } from "../store/authSlice";

function TestComponent() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mode, setMode] = useState("login");

  const dispatch = useDispatch();

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
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        value={password}
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {mode === "register" && (
        <input
          type="password"
          value={confirmPassword}
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      )}
      <button type="submit">{mode === "login" ? "Login" : "Register"}</button>
      <button
        type="button"
        onClick={() => setMode(mode === "login" ? "register" : "login")}
      >
        Switch to {mode === "login" ? "Register" : "Login"}
      </button>
    </form>
  );
}

export default TestComponent;
