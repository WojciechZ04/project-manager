import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import "./Sign.css";
import { BASE_URL } from "../../config";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupError, setSignupError] = useState("");

  const navigate = useNavigate();
  const signIn = useSignIn();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/sign/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        if (
          signIn({
            auth: {
              token: data.token,
              type: "Bearer",
            },
          })
        ) {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      setSignupError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="sign">
      <div className="sign-container">
        <h2>Signup</h2>
        {signupError && <p style={{ color: "red" }}>{signupError}</p>}
        <form onSubmit={handleSubmit}>
          <div class="input-group">
            <label class="label">Username</label>
            <input
              autocomplete="off"
              name="Username"
              id="Username"
              class="input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div class="input-group">
            <label class="label">Email</label>
            <input
              autocomplete="off"
              name="Email"
              id="Email"
              class="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div class="input-group">
            <label class="label">Password</label>
            <input
              autocomplete="off"
              name="Password"
              id="Password"
              class="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Signup</button>
        </form>
      </div>
      <p>
        Already have an account? <a href="/signin">Sign Ip</a>
      </p>
    </div>
  );
}

export default Signup;
