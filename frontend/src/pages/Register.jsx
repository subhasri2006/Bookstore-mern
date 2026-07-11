import { useState } from "react";
import logo from "../assets/logo.png";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { RecaptchaVerifier,signInWithPhoneNumber} from "firebase/auth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const handleRegister = async () => {
    try {
      // 🔥 Firebase create user
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      // ✅ SAVE EMAIL (VERY IMPORTANT FOR CART)
      localStorage.setItem("email", email);

      // ✅ Save user in DB (FIXED URL)
      await API.post("/users/register", {
        name,
        email,
        phone
      });

      alert("Registered Successfully 🔥");

      navigate("/home");
      

    } catch (err) {
      console.log("REGISTER ERROR:", err);
      alert("Registration Failed ❌");
    }
  };
  const sendOTP = async () => {
  try {
    const verifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "normal"
      }
    );

    const result = await signInWithPhoneNumber(
      auth,
      phone,
      verifier
    );

    setConfirmationResult(result);
    setShowOtpBox(true);
    console.log("PHONE =", phone);
    alert("OTP Sent ✅");

  } catch (err) {
    console.log(err);
    alert("Failed to send OTP ❌");
  }
};
const verifyOTP = async () => {
  try {
    await confirmationResult.confirm(otp);

    alert("Phone Verified ✅");

    handleRegister();

  } catch (err) {
    console.log(err);
    alert("Invalid OTP ❌");
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

        {/* LEFT */}
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

        {/* RIGHT */}
        <div style={{
          width: "67%",
          background: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "40px"
        }}>
          
          <h2>Create Account</h2>

          <input
            type="text"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            style={{ margin: "10px 0", padding: "10px" }}
          />

          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            style={{ margin: "10px 0", padding: "10px" }}
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ margin: "10px 0", padding: "10px" }}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            style={{ margin: "10px 0", padding: "10px" }}
          />
          <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              style={{ margin: "10px 0", padding: "10px" }}
            />
          {
              showOtpBox && (
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  style={{
                    margin: "10px 0",
                    padding: "10px"
                  }}
                />
              )
            }
          <div id="recaptcha-container"></div>
          {
  !showOtpBox ? (
    <button
      onClick={sendOTP}
      style={{
        background: "#FFD300",
        border: "none",
        padding: "10px",
        marginTop: "10px",
        cursor: "pointer"
      }}
    >
      Send OTP
    </button>
  ) : (
    <button
      onClick={verifyOTP}
      style={{
        background: "#4CAF50",
        border: "none",
        padding: "10px",
        marginTop: "10px",
        cursor: "pointer",
        color: "white"
      }}
    >
      Verify OTP & Register
    </button>
  )
}

        </div>
      </div>
    </div>
  );
}