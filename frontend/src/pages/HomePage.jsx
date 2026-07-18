import { useEffect, useState } from "react";
import API from "../api";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import noImage from "../assets/no-image.jpg";
import Toast from "../Components/Toast";
export default function HomePage({ toggleTheme, darkMode }) {
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  });

  const navigate = useNavigate();
  const email = localStorage.getItem("email");

 useEffect(() => {
  fetchUser();
  fetchWishlist();
}, []);
  useEffect(() => {
  fetchBooks();
}, [search]);
useEffect(() => {
  const delay = setTimeout(() => {
    fetchBooks(search);
  }, 400); // debounce

  return () => clearTimeout(delay);
}, [search]);

const fetchBooks = async (query = "") => {
  try {
    let url = "/books";

    if (query) {
      url = `/books/search?q=${query}`;
    }

    const res = await API.get(url);
    setBooks(res.data);
  } catch (err) {
    console.log(err);
  }
};
  const fetchUser = async () => {
    if (!email) return;
    setUser({ name: email.split("@")[0] });
  };

  // 🛒 ADD TO CART
  const addToCart = async (book) => {
    try {
      if (!email) {
        setToast({
          show: true,
          message: "Login required ❌",
          type: "error"
        });
        return;
      }

      await API.post("/users/cart", {
        email,
        bookId: book._id
      });

      setToast({
        show: true,
        message: "Cart Added Successfully!!",
        type: "success"
      });

    } catch (err) {
      console.log(err);

      setToast({
        show: true,
        message: "Failed ❌",
        type: "error"
      });
    }
  };

  // ⚡ BUY NOW
  const buyNow = (book) => {
    if (!email) {
      setToast({
        show: true,
        message: "Login required ❌",
        type: "error"
      });
      return;
    }

    navigate("/checkout", {
      state: { book }
    });
  };
  useEffect(() => {
  const delay = setTimeout(() => {
    fetchSuggestions();
  }, 300); // 🔥 debounce

  return () => clearTimeout(delay);
}, [search]);

const fetchSuggestions = async () => {
  try {
    if (!search) return setSuggestions([]);

    const res = await API.get(`/books/suggestions?q=${search}`);
    setSuggestions(res.data);
  } catch (err) {
    console.log(err);
  }
};
const fetchWishlist = async () => {
  try {
    const res = await API.get(`/users/wishlist/${email}`);
    setWishlist(res.data.map(b => b._id));
  } catch (err) {
    console.log(err);
  }
};
const toggleWishlist = async (bookId) => {
  try {
    // ✅ INSTANT UI UPDATE
    setWishlist((prev) => {
      if (prev.includes(bookId)) {
        return prev.filter((id) => id !== bookId);
      } else {
        return [...prev, bookId];
      }
    });

    // ✅ BACKEND CALL (no need to wait)
    await API.post("/users/wishlist", { email, bookId });
    await API.post("/interactions", {
      email,
      bookId,
      type: "wishlist"
    });
    setToast({
      show: true,
      message: "Wishlist updated ❤️",
      type: "success"
    });

  } catch (err) {
    console.log(err);
    console.log("Dark Mode:", darkMode);
  }
};
  return (
     <div style={{
          fontFamily: "Arial",
          width: "100%",
          paddingBottom: "80px",
          background: "transparent",
          color: "inherit"
    }}>
      {/* 🔝 NAVBAR */}


      {/* 👋 HERO BOX */}
      <div style={{
        marginTop: "200px",
        display: "flex",
        justifyContent: "center"
      }}>
        <div style={{
          width: "90%",
          background: darkMode ? "#1e1e1e" : "white",
          borderRadius: "20px",
          padding: "20px 60px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
          textAlign: "left"
        }}>
          <h1 style={{
            fontSize: "48px",
            fontWeight: "900",
            marginBottom: "10px",
            textTransform: "uppercase",
            color: darkMode ? "white" : "black",
            letterSpacing: "2px",
            lineHeight: "1.3"
          }}>
            Hii {user?.name}
          </h1>

          <p style={{
            fontSize: "30px",
            fontWeight: "600",
            marginBottom: "8px",
            letterSpacing: "2px",
            lineHeight: "1.3"
          }}>
            Welcome to Bookish
          </p>

          <p style={{
            fontSize: "20px",
            color: darkMode ? "#ddd" : "black",
            
            letterSpacing: "2px",
            lineHeight: "1.3"
          }}>
            Read, Love, Fall, Repeat....❤️
          </p>
        </div>
      </div>

      {/* 📚 BOOK LIST */}
<div style={{
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "70px",
  padding: "100px"
}}>
  {books.map((b) => (
    <div
      key={b._id}
      className="card"
      onClick={() => navigate(`/book/${b._id}`)}
      style={{
        borderRadius: "15px",
        padding: "100px",
        textAlign: "center",
        boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
        cursor: "pointer",
        transition: "all 0.3s ease",
        background: darkMode ? "#1e1e1e" : "white",
        color: darkMode ? "white" : "black",  
        position: "relative" // 🔥 IMPORTANT FIX
      }}
    >

      {/* ❤️ WISHLIST ICON */}
      <div
        style={{
          position: "absolute",
          top: "15px",
          right: "15px",
          fontSize: "32px",
          cursor: "pointer"
        }}
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(b._id);
        }}
      >
        {wishlist.includes(b._id) ? "❤️" : "🤍"}
      </div>

      {/* IMAGE */}
      <div style={{
        width: "100%",
        height: "350px",
        marginBottom: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: darkMode ? "#2a2a2a" : "#f5f5f5",
        borderRadius: "10px",
        overflow: "hidden"
      }}>
        <img
          src={b.image}
          alt={b.title}
          onError={(e) => (e.target.src = noImage)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain"
          }}
        />
      </div>

      {/* TITLE */}
      <h3 style={{
        fontSize: "30px",
        marginBottom: "10px",
        minHeight: "45px"
      }}>
        {b.title}
      </h3>

      {/* PRICE */}
      <p style={{
        fontWeight: "bold",
        fontSize: "27px",
        marginBottom: "20px"
      }}>
        ₹{b.price}
      </p>

<div style={{
  display: "flex",
  flexDirection: "column",
  gap: "15px"
}}>

  {/* 📘 BOOK DETAILS */}
  <button
    onClick={(e) => {
      e.stopPropagation();
      navigate(`/book/${b._id}`);
    }}
    style={{
      background: "#1a237e",
      color: "white",
      padding: "18px",
      border: "none",
      borderRadius: "15px",
      cursor: "pointer",
      fontSize: "22px",
      fontWeight: "bold"
    }}
  >
    📘 Book Details
  </button>

  {/* 🔽 BELOW BUTTONS */}
  <div style={{
    display: "flex",
    gap: "15px"
  }}>

    {/* 🛒 ADD TO CART */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        addToCart(b);
      }}
      style={{
        background: darkMode ? "#333" : "black",
        color: "white",
        padding: "20px",
        border: "none",
        borderRadius: "15px",
        cursor: "pointer",
        fontSize: "22px",
        flex: 1
      }}
    >
      Add to Cart
    </button>

    {/* ⚡ BUY NOW */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        buyNow(b);
      }}
      style={{
        background: "#FFD300",
        color: "black",
        padding: "20px",
        border: "none",
        borderRadius: "15px",
        cursor: "pointer",
        fontSize: "22px",
        fontWeight: "bold",
        flex: 1
      }}
    >
      Buy Now
    </button>

  </div>
</div>

    </div>
  ))}
</div>

      {/* 🔥 TOAST */}
      <Toast
        message={toast.message}
        show={toast.show}
        setShow={(val) => setToast({ ...toast, show: val })}
        type={toast.type}
      />

    </div>
  );
} 