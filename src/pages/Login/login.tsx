import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const body = { email, password };

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);

        navigate("/users");
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error("Login failed", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <main className="form-signin">
      <div
        className="container"
        style={{
          borderRadius: "15px",
          padding: "40px 30px",
          maxWidth: "450px",
          margin: "auto",
          height: "90vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        <form
          className="form-signin"
          style={{
            width: "100%",
            margin: "auto",
            transition: "transform 0.3s ease-in-out",
            boxSizing: "border-box",
          }}
          onSubmit={handleSubmit}
        >
          <h1
            className="h3 mb-4 fw-normal text-center"
            style={{
              color: "#000",
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: "1px",
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(7, 7, 7, 0.4)",
              transition: "color 0.5s ease",
            }}
          >
            Please sign in
          </h1>

          <div className="form-group mb-4">
            <label
              htmlFor="floatingInput"
              style={{ fontWeight: "bold", fontSize: "1.1rem" }}
            >
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="floatingInput"
              aria-label="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ marginTop: "5px", padding: "15px", fontSize: "1.1rem" }}
            />
          </div>

          <div className="form-group mb-4">
            <label
              htmlFor="floatingPassword"
              style={{ fontWeight: "bold", fontSize: "1.1rem" }}
            >
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              aria-label="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ marginTop: "5px", padding: "15px", fontSize: "1.1rem" }}
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="form-check text-start my-3">
            <input
              className="form-check-input"
              type="checkbox"
              value="remember-me"
              id="flexCheckDefault"
              style={{
                transform: "scale(1.2)",
                transition: "transform 0.2s ease-in-out",
              }}
            />
            <label className="form-check-label" htmlFor="flexCheckDefault">
              Remember me
            </label>
          </div>

          <button
            className="btn btn-primary w-100 py-3"
            type="submit"
            style={{
              fontSize: "16px",
              letterSpacing: "1px",
              borderRadius: "10px",
              transition: "background 0.3s, transform 0.3s",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
            }}
          >
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
};

export default Login;
