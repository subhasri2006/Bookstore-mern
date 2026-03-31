import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import logo from "../assets/logo.png";
import axios from "axios";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);

  useEffect(() => {
    fetchBook();
  }, []);

  const fetchBook = async () => {
    try {
      const res = await API.get(`/books/${id}`);
      setBook(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const addToCart = async () => {
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
    console.log(err);
    console.log(book._id);
    alert("Failed ❌");
  }
};
const askAI = () => {
  const response = `This book "${book.title}" is great for beginners and helps you understand core concepts in a simple way.`;
  alert(response);
};

  if (!book) return <h2>Loading...</h2>;
  const originalPrice = book.price + 200; // fake original price
const discount = Math.round(((originalPrice - book.price) / originalPrice) * 100);
  return (
  <div style={{ fontFamily: "Raleway", background: "#f5f5f5", minHeight: "100vh" }}>

    {/* 🔝 NAVBAR */}
    <div style={{
      backgroundColor: "#FFD300",
      padding: "15px 30px",
      display: "flex",
      justifyContent: "space-between"
    }}>
      <b>Bookish</b>

      <div>
        <span onClick={() => navigate("/home")} style={{ margin: "10px", cursor: "pointer" }}>
          Home
        </span>
        <span onClick={() => navigate("/cart")} style={{ margin: "10px", cursor: "pointer" }}>
          Cart
        </span>
      </div>
    </div>

    {/* 📘 MAIN CONTAINER */}
    <div style={{
      display: "flex",
      gap: "40px",
      padding: "40px",
      background: "white",
      margin: "30px",
      borderRadius: "10px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    }}>

      {/* 📸 LEFT - IMAGE */}
      <div style={{ flex: 1, textAlign: "center" }}>
        <img
          src={book.image}
          alt="book"
          style={{
            width: "300px",
            height: "400px",
            objectFit: "cover",
            borderRadius: "10px"
          }}
        />
      </div>

      {/* 📄 RIGHT - DETAILS */}
      <div style={{ flex: 2 }}>

        {/* TITLE */}
        <h1 style={{ marginBottom: "10px",lineHeight: "1.2",wordBreak: "break-word" }}>{book.title}</h1>
          
        {/* AUTHOR */}
        <p style={{ color: "gray", marginBottom: "10px" }}>
          by {book.author}
        </p>

        {/* CATEGORY (optional) */}
        <p style={{ color: "#555" }}>
          Category: {book.category || "Books"}
        </p>

        <div style={{ marginTop: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
  
  <h2 style={{ color: "#e53935" }}>
    ₹{book.price}
  </h2>

  <span style={{
    textDecoration: "line-through",
    color: "gray"
  }}>
    ₹{originalPrice}
  </span>

  {/* 🔥 DISCOUNT BADGE */}
  <span style={{
    background: "#e53935",
    color: "white",
    padding: "4px 8px",
    borderRadius: "5px",
    fontSize: "12px"
  }}>
    {discount}% OFF
  </span>

</div>

        {/* DESCRIPTION */}
        <p style={{ marginTop: "20px", lineHeight: "1.6" }}>
          {book.description || "No description available."}
        </p>

        {/* 🚚 DELIVERY */}
        <div style={{
          background: "#f0f0f0",
          padding: "10px",
          marginTop: "20px",
          borderRadius: "5px"
        }}>
          🚚 Delivery in 3-5 days
        </div>

        {/* 🛒 BUTTONS */}
        <div style={{ marginTop: "20px" }}>
          
          {/* ADD TO CART */}
          <button
            onClick={addToCart}
            style={{
              width: "100%",
              padding: "12px",
              background: "#1a237e",
              color: "white",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
              borderRadius: "5px"
            }}
          >
            🛒 ADD TO CART
          </button>

          {/* BUY NOW (optional) */}
          <button
            onClick={() => navigate("/cart")}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "10px",
              background: "#ddd",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
              borderRadius: "5px"
            }}
          >
            ❤️ BUY NOW
          </button>
          <button onClick={askAI}>
            🤖 Ask AI
          </button>

        </div>
      </div>
    </div>
  </div>
);
}