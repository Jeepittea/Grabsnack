import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import "../Style2.css";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email: email,
          password: password
        }
      );

      alert(response.data);

    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Login failed");
    }
  };


  // GOOGLE LOGIN
  const handleGoogleLogin = () => {
    window.location.href =
      "http://localhost:8080/oauth2/authorization/google";
  };


  return (
    <div className="login">

      <div className="login_title">
        Welcome Back Hungry?
        <br />
        Login to GrabSnack
      </div>

      <form onSubmit={handleLogin} className="login_fields">

        <div className="login_fields_user">
          <input
            type="text"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="login_fields_password">
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="login_fields_submit">
          <input type="submit" value="LOG IN" />

          <div className="forgot">
            <span>New to GrabSnack?</span>
            <br />
            <Link to="/register">Create an account</Link>
          </div>
        </div>

      </form>

      {/* GOOGLE LOGIN BUTTON */}

      <div style={{ marginTop: "15px", textAlign: "center" }}>
        <button
          onClick={handleGoogleLogin}
          style={{
            width: "100%",
            padding: "10px",
            background: "#db4437",
            border: "none",
            color: "white",
            cursor: "pointer"
          }}
        >
          Login with Google
        </button>
      </div>

    </div>
  );
}

export default Login;