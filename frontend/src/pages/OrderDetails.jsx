import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/orders/single/${id}`
      );
      setOrder(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!order) return <p style={{ padding: "40px" }}>Loading...</p>;

  return (
    <div style={{ padding: "40px", background: "#f5f5f5", minHeight: "100vh" }}>

      {/* 🔥 HEADER CARD */}
      <div style={{
        background: "white",
        borderRadius: "15px",
        padding: "30px",
        marginBottom: "30px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ marginBottom: "15px" }}>📦 Order Details</h2>

        <p style={{ fontSize: "16px", marginBottom: "8px" }}>
          <strong>Order ID:</strong> {order._id}
        </p>

        <p style={{ fontSize: "18px", fontWeight: "bold" }}>
          Total: ₹{order.total}
        </p>
      </div>

      {/* 📚 ITEMS */}
      <h3 style={{ marginBottom: "20px" }}>🛒 Items</h3>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px"
      }}>
        {order.items.map((item, index) => (
          <div
            key={index}
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              transition: "0.3s"
            }}

            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow =
                "0 10px 20px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(0,0,0,0.08)";
            }}
          >
            <h4 style={{ marginBottom: "10px" }}>
              {item.title}
            </h4>

            <p style={{ marginBottom: "5px" }}>
              💰 Price: ₹{item.price}
            </p>

            <p style={{ marginBottom: "10px" }}>
              📦 Quantity: {item.quantity}
            </p>

            <div style={{
              background: "#FFD300",
              padding: "6px 12px",
              borderRadius: "8px",
              display: "inline-block",
              fontWeight: "bold"
            }}>
              ₹{item.price * item.quantity}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default OrderDetails;