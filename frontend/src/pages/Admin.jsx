import { useEffect, useState } from "react";
import API from "../api";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

export default function Admin() {
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  const [showCrud, setShowCrud] = useState(false);

  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    image: "",
    description: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("email");

    if (email !== "subhasri4844@gmail.com") {
      navigate("/home");
      return;
    }

    // 🔥 Firebase token
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      user.getIdToken().then((token) => {
        console.log("🔥 Firebase Token:", token);
      });
    }

    fetchBooks();
    fetchOrders();
    fetchUsers();
  }, []);

  const fetchBooks = async () => {
    const res = await API.get("/books");
    setBooks(res.data);
  };

  const fetchOrders = async () => {
    const res = await API.get("/orders/all");
    setOrders(res.data);
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users"); // backend required
      setUsers(res.data);
    } catch (err) {
      console.log("Users API missing");
    }
  };

  const addBook = async () => {
    await API.post("/books", form);
    alert("Book added");

    setForm({
      title: "",
      author: "",
      price: "",
      image: "",
      description: ""
    });

    fetchBooks();
  };

  const deleteBook = async (id) => {
    await API.delete(`/books/${id}`);
    fetchBooks();
  };

  return (
    <div style={{ fontFamily: "Raleway", background: "#f7f7f7", minHeight: "100vh" }}>

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
          <b>Bookish Admin</b>
        </div>

        <div>
          <span onClick={() => navigate("/home")} style={navItem}>Home</span>
          <span onClick={() => navigate("/orders")} style={navItem}>Orders</span>
        </div>
      </div>

      {/* 📊 DASHBOARD CARDS */}
      <div style={dashboardGrid}>

        <div style={dashCard}>
          <h2>📚 Books</h2>
          <h3>{books.length}</h3>
        </div>

        <div style={dashCard}>
          <h2>📦 Orders</h2>
          <h3>{orders.length}</h3>
        </div>

        <div style={dashCard}>
          <h2>👥 Users</h2>
          <h3>{users.length}</h3>
        </div>

        <div style={dashCard}>
          <h2>⚙️ CRUD</h2>
          <button style={yellowBtn} onClick={() => setShowCrud(true)}>
            Manage Books
          </button>
        </div>

      </div>

      {/* 🪟 CRUD MODAL */}
      {showCrud && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h2>Manage Books</h2>

            <button style={modalBtn} onClick={() => navigate("/admin/add-book")}>
              ➕ Add Book
            </button>

            <button style={modalBtn} onClick={() => navigate("/admin/update-book")}>
              ✏️ Update Book
            </button>

            <button style={modalBtn} onClick={() => navigate("/admin/delete-book")}>
              ❌ Delete Book
            </button>

            <button style={{ ...modalBtn, background: "gray" }} onClick={() => setShowCrud(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      

      {/* 📚 BOOK LIST */}
      <div style={{ padding: "20px" }}>
        <h2>Books</h2>

        <div style={gridCards}>
          {books.map(book => (
            <div key={book._id} style={bookCard}>
              <img src={book.image} style={bookImg} />
              <h3>{book.title}</h3>
              <p>₹{book.price}</p>

              <button onClick={() => deleteBook(book._id)} style={redBtn}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 📦 ORDERS */}
      <div style={{ padding: "20px" }}>
        <h2>Orders</h2>

        {orders.map((order, i) => (
          <div key={i} style={orderCard}>
            <p>Email: {order.email}</p>
            <p>Total: ₹{order.total}</p>
          </div>
        ))}
      </div>

      {/* 🔻 FOOTER */}
      <div style={{
        backgroundColor: "black",
        color: "#FFD300",
        padding: "15px",
        textAlign: "center",
        marginTop: "20px"
      }}>
        Bookish Admin Panel
      </div>
    </div>
  );
}

/* 🎨 STYLES */

const navItem = {
  margin: "10px",
  cursor: "pointer"
};

const dashboardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px",
  padding: "20px"
};

const dashCard = {
  background: "#fff",
  padding: "25px",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
};

const gridCards = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px"
};

const bookCard = {
  border: "1px solid #ccc",
  borderRadius: "10px",
  padding: "15px",
  textAlign: "center",
  background: "#fff"
};

const bookImg = {
  width: "100%",
  height: "150px",
  objectFit: "cover",
  borderRadius: "8px"
};

const orderCard = {
  border: "1px solid #ccc",
  padding: "10px",
  margin: "10px 0",
  borderRadius: "8px",
  background: "#fff"
};

const yellowBtn = {
  marginTop: "10px",
  padding: "10px 20px",
  background: "#FFD300",
  border: "none",
  cursor: "pointer",
  borderRadius: "6px",
  fontWeight: "bold"
};

const redBtn = {
  marginTop: "10px",
  padding: "8px 12px",
  background: "red",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

const formGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "10px"
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const modalBox = {
  background: "#fff",
  padding: "30px",
  borderRadius: "10px",
  width: "300px",
  textAlign: "center"
};

const modalBtn = {
  display: "block",
  width: "100%",
  margin: "10px 0",
  padding: "10px",
  background: "black",
  color: "#FFD300",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};