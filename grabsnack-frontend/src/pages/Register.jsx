import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import "../Style2.css";

function Register() {

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        {
          fullName: fullName,
          email: email,
          password: password
        }
      );

      alert(response.data);

    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Registration failed");
    }
  };

  return (
    <div className="login">

      <div className="login_title">
        Join GrabSnack 🍔
        <br />
        Create your account
      </div>

      <form onSubmit={handleRegister} className="login_fields">

        <div className="login_fields__user">
          <input
            type="text"
            placeholder="Full Name"
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="login_fields__user">
          <input
            type="text"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="login_fields__password">
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="login_fields__submit">
          <input type="submit" value="REGISTER" />

          <div className="forgot">
            <span>Already have an account?</span>
            <br />
            <Link to="/login">Login here</Link>
          </div>
        </div>

      </form>

    </div>
  );
}

export default Register;