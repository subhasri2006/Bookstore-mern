import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import API from "../api";
import { useNavigate } from "react-router-dom";
export default function Orders({ darkMode }) {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  useEffect(() => {
    if (email) fetchOrders();
  }, [email]);
  const fetchOrders = async () => {
    try {
      const res = await API.get(`/orders/${email}`);
      setOrders(res.data || []);
    } catch (err) {
      console.log(err);
      setOrders([]);
    }
  };
  return (
    <div style={{
      fontFamily: "Arial",
      paddingBottom: "80px",
      background: darkMode ? "#121212" : "white",
      color: darkMode ? "white" : "black",
      minHeight: "100vh"
    }}>

     

      {/* 📦 ORDERS GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "30px",
        padding: "40px"
      }}>
        {orders.length === 0 ? (
          <h2>No Orders Yet 😢</h2>
        ) : (
          orders.map((order) => {

            const firstItem = order.items?.[0];

            return (
              <div key={order._id} style={{
                borderRadius: "15px",
                padding: "50px",
                background: darkMode ? "#1e1e1e" : "white",
                boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                transition: "0.3s",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
              >

                {/* 🧾 ORDER HEADER */}
                <div style={{ marginBottom: "15px" }}>
                  <p style={{ fontSize: "12px", color: darkMode ? "#aaa" : "gray" }}>
                    Order ID
                  </p>
                  <p style={{ fontWeight: "bold", fontSize: "14px" }}>
                    {order._id}
                  </p>
                </div>

                {/* 📸 BOOK IMAGE */}
                {firstItem && (
                  <div style={{
                    width: "100%",
                    height: "180px",
                    background: darkMode ? "#2a2a2a" : "#f5f5f5",
                    borderRadius: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "15px"
                  }}>
                    <img
                      src={firstItem.image}
                      alt=""
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain"
                      }}
                    />
                  </div>
                )}

                {/* 📘 TITLE */}
                <h3 style={{
                  fontSize: "18px",
                  marginBottom: "5px"
                }}>
                  {firstItem?.title || "Book"}
                </h3>

                {/* ➕ MORE ITEMS */}
                {order.items?.length > 1 && (
                  <p style={{ fontSize: "13px", color: darkMode ? "#aaa" : "gray" }}>
                    +{order.items.length - 1} more items
                  </p>
                )}

                {/* 💰 TOTAL + STATUS */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "15px"
                }}>
                  <span style={{
                    fontWeight: "bold",
                    fontSize: "18px"
                  }}>
                    ₹{order.total}
                  </span>

                  {/* 🟢 STATUS */}
                  <span style={{
                    background: "#e8f5e9",
                    color: "#2e7d32",
                    padding: "5px 10px",
                    borderRadius: "10px",
                    fontSize: "12px",
                    fontWeight: "bold"
                  }}>
                    Delivered
                  </span>
                </div>
                {/* 🔘 BUTTON */}
                <button
                  onClick={() => navigate(`/orders/${order._id}`)}
                  style={{
                    marginTop: "15px",
                    width: "100%",
                    padding: "10px",
                    background: darkMode ? "white" : "black",
                    color: darkMode ? "black" : "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer"
                  }}
                >
                  View Details
                </button>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}