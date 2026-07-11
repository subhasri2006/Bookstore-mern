import { useEffect, useState } from "react";
import axios from "axios";
import API from "../api";
import { useNavigate, useLocation } from "react-router-dom";

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("cod");
  const [upiId, setUpiId] = useState("");

  // 🔥 NOTIFICATION STATE
  const [notify, setNotify] = useState({
    show: false,
    message: "",
    type: "success" // success | error
  });

  const navigate = useNavigate();
  const location = useLocation();

  const selectedBook = location.state?.book;

  useEffect(() => {
    if (!selectedBook) {
      fetchCart();
    }
  }, []);

  const fetchCart = async () => {
    try {
      const email = localStorage.getItem("email");
      const res = await axios.get(
        `http://localhost:5000/api/users/cart/${email}`
      );
      setCart(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ ITEM LOGIC
  const itemToShow = selectedBook
    ? { bookId: selectedBook, quantity: 1 }
    : cart[cart.length - 1];

  const total = itemToShow
    ? Number(itemToShow.bookId.price) * itemToShow.quantity
    : 0;

  // 🔥 SHOW NOTIFICATION
  const showNotification = (message, type = "success") => {
    setNotify({ show: true, message, type });

    setTimeout(() => {
      setNotify({ show: false, message: "", type: "success" });
    }, 5000);
  };

  const placeOrder = async () => {
    try {
      const email = localStorage.getItem("email");

      if (!email) return showNotification("Login required ❌", "error");
      if (!address) return showNotification("Enter address ❌", "error");
      if (payment === "upi" && !upiId)
        return showNotification("Enter UPI ID ❌", "error");

      await API.post("/orders", { email });

      // ✅ SUCCESS NOTIFICATION
      showNotification("Order placed successfully 🎉", "success");

      setTimeout(() => {
        navigate("/orders");
      }, 2000);

    } catch (err) {
      console.log(err);
      showNotification("Order failed ❌", "error");
    }
  };

  return (
    <div>

      {/* 🔔 RIGHT SLIDE NOTIFICATION */}
      {notify.show && (
  <div style={{
    position: "fixed",
    bottom: "90px",   // 🔥 bottom-right (above navbar)
    right: "0",
    zIndex: 2000,
    transform: "skewX(-20deg)",
    background:
      notify.type === "success" ? "#a5d6a7" : "#ef9a9a",
    padding: "40px 100px",   // 🔥 BIG parallelogram
    boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
    animation: "slideIn 0.5s ease"
  }}>
    <div style={{
      transform: "skewX(20deg)",
      color: notify.type === "success" ? "#1b5e20" : "#b71c1c",
      fontSize: "30px",      // 🔥 BIG text
      fontWeight: "bold"
    }}>
      {notify.message}
    </div>
  </div>
)}

      {/* 🟡 NAVBAR */}
      <div style={{
        background: "#FFD300",
        padding: "15px",
        fontWeight: "bold",
        textAlign: "center"
      }}>
        Order Summary
      </div>

      <div style={{ padding: "30px", maxWidth: "500px", margin: "auto" }}>

        {/* 📚 ITEM */}
        {itemToShow && (
          <div
            className="card"
            style={{
              padding: "20px",
              textAlign: "center",
              marginBottom: "20px"
            }}
          >
            <img
              src={itemToShow.bookId?.image}
              alt=""
              style={{
                width: "150px",
                height: "200px",
                objectFit: "contain"
              }}
            />

            <h3>{itemToShow.bookId?.title}</h3>
            <p>₹{itemToShow.bookId?.price}</p>

            <button className="btn">
              Qty: {itemToShow.quantity}
            </button>
          </div>
        )}

        {/* 🏠 ADDRESS */}
        <div style={{ marginBottom: "20px" }}>
          <h4>Delivery Address</h4>

          <div style={{ position: "relative" }}>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
              style={{
                width: "100%",
                padding: "10px",
                height: "80px"
              }}
            />
          </div>
        </div>

        {/* 💳 PAYMENT */}
        <div style={{ marginBottom: "20px" }}>
          <h4>Payment</h4>

          <label>
            <input
              type="radio"
              checked={payment === "upi"}
              onChange={() => setPayment("upi")}
            /> UPI
          </label>

          <label style={{ marginLeft: "15px" }}>
            <input
              type="radio"
              checked={payment === "cod"}
              onChange={() => setPayment("cod")}
            /> Cash on Delivery
          </label>

          {payment === "upi" && (
            <input
              type="text"
              placeholder="Enter UPI ID"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              style={{
                width: "100%",
                marginTop: "10px",
                padding: "10px"
              }}
            />
          )}
        </div>

        {/* 💰 TOTAL */}
        <h3>Total: ₹{total}</h3>

        {/* ✅ BUTTON */}
        <button
          onClick={placeOrder}
          className="btn"
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "15px"
          }}
        >
          Proceed to Payment
        </button>

      </div>

      {/* 🔥 ANIMATION */}
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%) skewX(-20deg);
              opacity: 0;
            }
            to {
              transform: translateX(0) skewX(-20deg);
              opacity: 1;
            }
          }
        `}
      </style>

    </div>
  );
}