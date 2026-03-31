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

  // ✅ EMAIL LOGIN
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential?.user;

      console.log("LOGIN EMAIL:", user?.email);

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
      console.log(err.message);
      alert(err.message);
    }
  };

  // ✅ GOOGLE LOGIN (FIXED)
  const handleGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      console.log("GOOGLE EMAIL:", user.email);

      localStorage.setItem("email", user.email);

      if (user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        navigate("/admin");
      } else {
        navigate("/home");
      }

    } catch (err) {
      console.log(err.message);
      alert(err.message);
    }
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f5f5f5"
    }}>
      
      <div style={{
        width: "800px",
        height: "450px",
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
          <img src={logo} alt="logo" style={{ width: "80px" }} />
          <h2>Bookish</h2>
        </div>

        {/* RIGHT SIDE */}
        <div style={{
          width: "67%",
          background: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "40px"
        }}>
          
          <h2>Login</h2>

          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            style={{ margin: "10px 0", padding: "10px" }}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            style={{ margin: "10px 0", padding: "10px" }}
          />

          <button
            onClick={handleLogin}
            style={{
              background: "#FFD300",
              border: "none",
              padding: "10px",
              marginTop: "10px",
              cursor: "pointer"
            }}
          >
            Login
          </button>

          <button
            onClick={handleGoogle}
            style={{
              marginTop: "15px",
              padding: "10px",
              cursor: "pointer"
            }}
          >
            Continue with Google
          </button>

          <p style={{ marginTop: "15px" }}>
            Don't have an account?
            <span
              onClick={() => navigate("/register")}
              style={{ color: "blue", cursor: "pointer", marginLeft: "5px" }}
            >
              Register
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}