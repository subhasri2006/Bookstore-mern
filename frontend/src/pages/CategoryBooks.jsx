import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import noImage from "../assets/no-image.jpg";
import Toast from "../Components/Toast";

export default function CategoryBooks({ darkMode }) {
  const { category } = useParams();

  const [books, setBooks] = useState([]);
  const [wishlist, setWishlist] = useState([]);

    const [toast, setToast] = useState({
  show: false,
  message: "",
  type: "success"
});
useEffect(() => {
  fetchWishlist();
}, []);

const email = localStorage.getItem("email");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, [category]);

  const fetchBooks = async () => {
    try {
      const res = await API.get(
        `/books/category/${encodeURIComponent(category)}`
      );

      setBooks(res.data);
    } catch (err) {
      console.log(err);
    }
  };
const fetchWishlist = async () => {
  try {
    const res = await API.get(`/users/wishlist/${email}`);
    setWishlist(res.data.map((b) => b._id));
  } catch (err) {
    console.log(err);
  }
};

const toggleWishlist = async (bookId) => {
  try {
    setWishlist((prev) => {
      if (prev.includes(bookId)) {
        return prev.filter((id) => id !== bookId);
      }
      return [...prev, bookId];
    });

    await API.post("/users/wishlist", {
      email,
      bookId
    });

    setToast({
      show: true,
      message: "Wishlist updated ❤️",
      type: "success"
    });
  } catch (err) {
    console.log(err);
  }
};

const addToCart = async (book) => {
  try {
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
  }
};

const buyNow = (book) => {
  navigate("/checkout", {
    state: { book }
  });
};
  return (
    <div
      style={{
        padding: "120px 50px"
      }}
    >
      <h1
        style={{
          marginBottom: "50px",
          textAlign: "center"
        }}
      >
        📚 {category}
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "30px"
        }}
      >
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
      position: "relative"
    }}
  >
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

    <div
      style={{
        width: "100%",
        height: "350px",
        marginBottom: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: darkMode ? "#2a2a2a" : "#f5f5f5",
        borderRadius: "10px",
        overflow: "hidden"
      }}
    >
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

    <h3
      style={{
        fontSize: "30px",
        marginBottom: "10px",
        minHeight: "45px"
      }}
    >
      {b.title}
    </h3>

    <p
      style={{
        fontWeight: "bold",
        fontSize: "27px",
        marginBottom: "20px"
      }}
    >
      ₹{b.price}
    </p>

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "15px"
      }}
    >
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

      <div
        style={{
          display: "flex",
          gap: "15px"
        }}
      >
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
      <Toast
  message={toast.message}
  show={toast.show}
  setShow={(val) => setToast({ ...toast, show: val })}
  type={toast.type}
/>
    </div>
  );
}