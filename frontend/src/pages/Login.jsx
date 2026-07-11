import { useState } from "react";
import logo from "../assets/logo.png";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const ADMIN_EMAIL = "subhasri4844@gmail.com";

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential?.user;

      if (!user) {
        alert("Login failed");
        return;
      }

      localStorage.setItem("email", user.email);

      if (user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        navigate("/admin");
      } else {
        navigate("/home");
      }

    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      localStorage.setItem("email", user.email);

      if (user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        navigate("/admin");
      } else {
        navigate("/home");
      }

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{
      height: "100vh",
      overflow: "auto",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f5f5f5"
    }}>
      
      <div style={{
        width: "2000px",
        height: "950px",
        display: "flex",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 5px 15px rgba(0,0,0,0.2)"
      }}>

        {/* LEFT SIDE */}
        <div style={{
          width: "33%",
          background: "#FFD300",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <img src={logo} alt="logo" style={{ width: "250px" }} />
          <h2 style={{ fontSize: "40px" }}>Bookish</h2>
        </div>

        {/* RIGHT SIDE */}
        <div style={{
          width: "67%",
          background: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px"
        }}>
          
          <h2 style={{ fontSize: "50px", marginBottom: "30px" }}>Login</h2>

          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            style={{
              margin: "20px 0",
              padding: "20px",
              fontSize: "22px",
              borderRadius: "5px"
            }}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            style={{
              margin: "20px 0",
              padding: "20px",
              fontSize: "22px",
              borderRadius: "5px"
            }}
          />

          <button
            onClick={handleLogin}
            style={{
              background: "#FFD300",
              border: "none",
              padding: "20px",
              marginTop: "20px",
              cursor: "pointer",
              fontSize: "22px",
              fontWeight: "bold"
            }}
          >
            Login
          </button>

          <button
            onClick={handleGoogle}
            style={{
              marginTop: "25px",
              padding: "20px",
              cursor: "pointer",
              fontSize: "22px"
            }}
          >
            Continue with Google
          </button>

          <p style={{ marginTop: "30px", fontSize: "20px" }}>
            Don't have an account?
            <span
              onClick={() => navigate("/register")}
              style={{
                color: "blue",
                cursor: "pointer",
                marginLeft: "10px",
                fontSize: "20px"
              }}
            >
              Register
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}