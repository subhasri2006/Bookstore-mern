import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const email = localStorage.getItem("email");

  // 🔄 Load cart on page load
  useEffect(() => {
    if (email) fetchCart();
  }, [email]);

  // 📦 FETCH CART
  const fetchCart = async () => {
    try {
      const res = await API.get(`/users/cart/${email}`);
      setCart(res.data || []);
    } catch (err) {
      console.log("FETCH ERROR:", err);
      setCart([]);
    }
  };

  // ➕➖ UPDATE QUANTITY
  const updateQty = async (bookId, qty) => {
    if (qty < 1) return;

    try {
      await API.put("/users/cart", {
        email,
        bookId,
        quantity: qty
      });

      fetchCart();
    } catch (err) {
      console.log("UPDATE ERROR:", err);
    }
  };

  // ❌ REMOVE ITEM
  const removeItem = async (bookId) => {
    try {
      await API.delete(`/users/cart/${bookId}?email=${email}`);
      fetchCart();
    } catch (err) {
      console.log("DELETE ERROR:", err);
    }
  };

  // 💰 TOTAL PRICE
  const total = cart.reduce((acc, item) => {
    if (!item.bookId) return acc;
    return acc + item.bookId.price * item.quantity;
  }, 0);

  return (
    <div style={{ fontFamily: "Raleway" }}>

      {/* 🔝 NAVBAR */}
      <div style={{
        backgroundColor: "#FFD300",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src={logo} alt="logo" style={{ height: "40px" }} />
          <b>Bookish</b>
        </div>

        <div>
          <span 
            onClick={() => navigate("/home")} 
            style={{ margin: "10px", cursor: "pointer" }}
          >
            Home
          </span>

          <span style={{ margin: "10px" }}>Cart</span>
        </div>
      </div>

      {/* 🛒 CART ITEMS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px",
        padding: "30px"
      }}>
        {cart.length === 0 ? (
          <h2>Your Cart is Empty 😢</h2>
        ) : (
          cart.map((item, index) => (
            <div key={index} style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "15px",
              textAlign: "center",
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
            }}>
              <img
                src={item.bookId?.image}
                alt="book"
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "8px"
                }}
              />

              <h3>{item.bookId?.title}</h3>
              <p>₹{item.bookId?.price}</p>

              {/* ➕➖ QUANTITY */}
              <div style={{ margin: "10px" }}>
                <button onClick={() => updateQty(item.bookId._id, item.quantity - 1)}>-</button>
                <span style={{ margin: "0 10px" }}>{item.quantity}</span>
                <button onClick={() => updateQty(item.bookId._id, item.quantity + 1)}>+</button>
              </div>

              {/* ❌ REMOVE */}
              <button
                onClick={() => removeItem(item.bookId._id)}
                style={{
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  padding: "8px",
                  cursor: "pointer",
                  borderRadius: "5px"
                }}
              >
                Remove
              </button>
              <button
                onClick={() => navigate("/checkout", { state: { item } })}
                style={{
                  marginTop: "10px",
                  background: "black",
                  color: "white",
                  border: "none",
                  padding: "10px",
                  cursor: "pointer",
                  borderRadius: "5px",
                  width: "100%"
                }}
                >
                  Buy Now
              </button>
            </div>
          ))
        )}
      </div>

      {/* 💰 TOTAL */}
      <div style={{
        textAlign: "center",
        fontSize: "20px",
        fontWeight: "bold"
      }}>
        

       
      </div>

      {/* 🔻 FOOTER */}
      <div style={{
        backgroundColor: "black",
        color: "#FFD300",
        padding: "15px",
        textAlign: "center",
        marginTop: "20px"
      }}>
        About | Contact
      </div>
    </div>
  );
}