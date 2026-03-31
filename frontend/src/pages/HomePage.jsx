import { useEffect, useState } from "react";
import API from "../api";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import noImage from "../assets/no-image.jpg";
import axios from "axios";

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // ✅ USE ONLY ONE KEY
  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    fetchBooks();
    fetchUser();
  }, []);

  // 📚 Fetch books
  const fetchBooks = async () => {
    try {
      const res = await API.get("/books");
      setBooks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 👤 Fetch user
  const fetchUser = async () => {
    try {
      if (!email) return;
      setUser({ name: email.split("@")[0] });
    } catch (err) {
      console.log(err);
    }
  };
  const addToCart = async (book) => {
  try {
    const email = localStorage.getItem("email");

    if (!email) {
      alert("Please login first ❌");
      return;
    }

    await API.post("/users/cart", {
      email,
      bookId: book._id
    });

    alert("Added to cart 🛒");
  } catch (err) {
    console.log("ADD ERROR:", err);
    alert("Failed to add ❌");
  }
};


  return (
    <div style={{ fontFamily: "Arial", width: "100%" }}>

      {/* NAVBAR */}
      <nav style={{
        backgroundColor: "#FFD300",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontWeight: "bold"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src={logo} alt="logo" style={{ height: "40px" }} />
          <span>Bookish</span>
        </div>

        <div>
          {user ? <span>Hi {user.name} 👋</span> : <span>Loading...</span>}
        </div>

        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <span>Programming</span>
          <span>Story</span>
          <span>Romance</span>
          <span>Journal</span>

          <span onClick={() => navigate("/cart")} style={{ cursor: "pointer", fontSize: "18px" }}>
            🛒
          </span>
        </div>
      </nav>

      {/* BOOK LIST */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px",
        padding: "30px"
      }}>
        {books.map((b) => (
          <div key={b._id}
            onClick={() => navigate(`/book/${b._id}`)}
            style={{
              border: "1px solid #ddd",
              background: "#fff",
              padding: "15px",
              textAlign: "center",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
            }}
          >
            <div style={{
              width: "180px",
              height: "180px",
              margin: "0 auto 15px auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}>
              <img
                src={b.image}
                alt={b.title}
                onError={(e) => e.target.src = noImage}
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            </div>

            <h3>{b.title}</h3>
            <p>₹{b.price}</p>

            <button
              onClick={() => addToCart(b)}
              style={{
                background: "black",
                color: "white",
                padding: "10px",
                border: "none",
                cursor: "pointer"
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}