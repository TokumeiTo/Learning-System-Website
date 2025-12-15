import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [companyCode, setCompanyCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError("");
      await login(companyCode, password);
      navigate("/dashboard"); // Redirect to dashboard after login
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Company Code"
        value={companyCode}
        onChange={(e) => setCompanyCode(e.target.value)}
        style={{ display: "block", marginBottom: 10, width: "100%" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: 10, width: "100%" }}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleLogin} style={{ width: "100%" }}>
        Login
      </button>
      <p style={{ fontSize: 12, marginTop: 10 }}>Mock password: "password123"</p>
    </div>
  );
};
