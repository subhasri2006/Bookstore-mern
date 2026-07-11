import { useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaBook, FaBox, FaShoppingCart } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
export default function BottomNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchCartCount();
  }, []);

  const fetchCartCount = async () => {
    try {
      const email = localStorage.getItem("email");
      if (!email) return;

      const res = await axios.get(
        `http://localhost:5000/api/users/cart/${email}`
      );

      // 🔥 total quantity count
      const count = res.data.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(count);
    } catch (err) {
      console.log(err);
    }
  };

  const items = [
    { path: "/home", label: "Home", icon: <FaHome /> },
    { path: "/Categories", label: "Categories", icon: <FaBook /> },
    { path: "/orders", label: "Orders", icon: <FaBox /> },
    { path: "/cart", label: "Cart", icon: <FaShoppingCart />, badge: true },
    { path: "/wishlist", label: "Wishlist", icon: <FaHeart /> },
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "#FFD300",
        display: "flex",
        justifyContent: "space-around",
        padding: "10px 0",
        borderTop: "1px solid #ccc",
        zIndex: 1000
      }}
    >
      {items.map((item, index) => {
        const isActive = location.pathname === item.path;

        return (
          <div
            key={index}
            onClick={() => navigate(item.path)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              flex: 1,
              position: "relative",
              color: isActive ? "white" : "#555"
            }}
          >
            {/* ICON */}
            <div style={{ fontSize: "50px" }}>
              {item.icon}
            </div>

            {/* 🔴 BADGE */}
            {item.badge && cartCount > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "0px",
                  right: "45%",
                  background: "red",
                  color: "white",
                  borderRadius: "50%",
                  fontSize: "10px",
                  padding: "2px 6px",
                  fontWeight: "bold"
                }}
              >
                {cartCount}
              </div>
            )}

            <span style={{ fontSize: "13px" }}>{item.label}</span>
            
            {/* ACTIVE LINE */}
            {isActive && (
              <div
                style={{
                  width: "20px",
                  height: "3px",
                  background: "black",
                  marginTop: "4px",
                  borderRadius: "2px"
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}