import { useEffect, useState } from "react";
import axios from "axios";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    fetchCart();
  }, []);

const fetchCart = async () => {
  try {
    const email = localStorage.getItem("email");
    console.log("EMAIL:", email);
    const res = await axios.get(
      `http://localhost:5000/api/users/cart/${email}`
    );

    
    setCart(res.data);
  } catch (err) {
    console.log(err);
  }
};
const total = cart.reduce(
  (acc, item) => acc + Number(item.bookId.price) * item.quantity,
  0
);
  
const placeOrder = async () => {
  try {
    const email = localStorage.getItem("email"); // ✅ FIXED

    console.log("ORDER EMAIL:", email);

    if (!email) {
      alert("User not logged in ❌");
      return;
    }

    const res = await API.post("/orders", {
      email: email
    });

    console.log("ORDER RESPONSE:", res.data);

    alert("Order placed successfully 🎉");

    navigate("/orders"); // ✅ redirect

  } catch (err) {
    console.log("FULL ERROR:", err);
    console.log("BACKEND ERROR:", err.response?.data);
    alert("Order failed ❌");
  }
};

  return (
    <div style={{ padding: "30px" }}>

      <h2>Checkout</h2>
        
      {/* 🏠 ADDRESS */}
      <div style={{ marginTop: "20px" }}>
        <h3>Delivery Address</h3>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your address"
          style={{ width: "100%", padding: "10px", height: "100px" }}
        />
      </div>

      {/* 💳 PAYMENT */}
      <div style={{ marginTop: "20px" }}>
        <h3>Payment Method</h3>
        <p>Cash on Delivery</p>
      </div>

      {/* 📦 SUMMARY */}
      <div style={{ marginTop: "20px" }}>
        <h3>Order Summary</h3>
        {cart.map((item, i) => (
          <p key={i}>
            {item.bookId?.title} - ₹{item.bookId?.price} x {item.quantity}
          </p>
        ))}

        <h2>Total: ₹{total}</h2>
      </div>

      {/* ✅ BUTTON */}
      <button
        onClick={placeOrder}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "black",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        Confirm Order
      </button>
    </div>
  );
}