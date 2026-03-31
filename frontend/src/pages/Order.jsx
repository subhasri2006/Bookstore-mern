import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Orders() {
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

          <span style={{ margin: "10px" }}>Orders</span>
        </div>
      </div>

      {/* 📦 ORDERS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
        padding: "30px"
      }}>
        {orders.length === 0 ? (
          <h2>No Orders Yet 😢</h2>
        ) : (
          orders.map((order) => (
            <div key={order._id} style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "15px",
              textAlign: "center",
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
            }}>

              <h3 style={{ marginBottom: "10px" }}>
                Order ID
              </h3>

              <p style={{ fontSize: "12px", color: "gray" }}>
                {order._id}
              </p>

              <p style={{ fontWeight: "bold", margin: "15px 0" }}>
                Total: ₹{order.total}
              </p>

              <button
                onClick={() => navigate(`/orders/${order._id}`)}
                style={{
                  background: "black",
                  color: "white",
                  border: "none",
                  padding: "10px",
                  cursor: "pointer",
                  width: "100%"
                }}
              >
                View Details
              </button>

            </div>
          ))
        )}
      </div>

      {/* 🔻 FOOTER */}
      <div style={{
        backgroundColor: "black",
        color: "#FFD300",
        padding: "15px",
        textAlign: "center"
      }}>
        About | Contact
      </div>

    </div>
  );
}