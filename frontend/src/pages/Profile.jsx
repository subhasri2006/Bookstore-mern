import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>👤 My Account</h2>

      <p><strong>Email:</strong> {email}</p>

      <hr style={{ margin: "20px 0" }} />

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        
        <button onClick={() => navigate("/orders")}>
          📦 Your Orders
        </button>

        <button onClick={() => navigate("/cart")}>
          🛒 Your Cart
        </button>

        <button onClick={handleLogout}>
          🚪 Logout
        </button>

      </div>
    </div>
  );
}