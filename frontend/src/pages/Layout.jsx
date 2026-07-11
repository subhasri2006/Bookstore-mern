import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import API from "../api";

export default function Layout({ toggleTheme, darkMode }) {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // 🔥 FETCH SUGGESTIONS
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchSuggestions();
    }, 300);

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

  return (
    <div style={{
      background: darkMode ? "#121212" : "#ffffff",
      minHeight: "100vh",
      color: darkMode ? "white" : "black"
    }}>

      {/* 🔝 NAVBAR */}
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "#FFD300",
        padding: "20px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontWeight: "bold",
        zIndex: 1000
      }}>

        {/* 🟡 LEFT */}
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <img src={logo} alt="logo" style={{ height: "75px" }} />
          <span style={{ fontSize: "45px", fontWeight: "800" }}>
            Bookish
          </span>
        </div>

        {/* 🔍 CENTER SEARCH */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <div style={{ width: "50%", position: "relative" }}>

            <div style={{
              display: "flex",
              alignItems: "center",
              background: darkMode ? "#1e1e1e" : "white",
              borderRadius: "30px",
              padding: "10px 20px"
            }}>
              <span style={{ marginRight: "10px" }}>🔍</span>

              <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        navigate(
                          `/search?q=${encodeURIComponent(search)}`
                        );

                        setSuggestions([]);
                      }
                    }}
                placeholder="Search books..."
                style={{
                  border: "none",
                  outline: "none",
                  width: "100%",
                  background: "transparent",
                  color: darkMode ? "white" : "black"
                }}
              />
            </div>

            {/* 🔥 DROPDOWN */}
            {suggestions.length > 0 && (
              <div style={{
                position: "absolute",
                top: "60px",
                width: "100%",
                background: darkMode ? "#1e1e1e" : "white",
                borderRadius: "10px"
              }}>
                {suggestions.map((s, i) => (
                    <div
                        key={i}
                        onClick={() => {
                          navigate(`/book/${s._id}`);
                          setSearch("");
                          setSuggestions([]);
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            darkMode ? "#333" : "#f5f5f5";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            darkMode ? "#1e1e1e" : "white";
                        }}
                        style={{
                          padding: "15px",
                          cursor: "pointer",
                          borderBottom: "1px solid #ddd",
                          transition: "0.2s"
                        }}
                      >
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: "16px"
                        }}
                      >
                        📘 {s.title}
                      </div>

                      <div
                        style={{
                          fontSize: "13px",
                          color: darkMode ? "#ccc" : "#666",
                          marginTop: "4px"
                        }}
                      >
                        ✍️ {s.author}
                      </div>

                      <div
                        style={{
                          fontSize: "13px",
                          color: "#1a237e",
                          marginTop: "2px"
                        }}
                      >
                        🏷️ {s.category}
                      </div>
                    </div>
                  ))}
              </div>
            )}

          </div>
        </div>

        {/* 🌙 THEME BUTTON */}
        {/* 🔥 RIGHT SIDE */}
<div style={{ display: "flex", alignItems: "center", gap: "15px" }}>

  {/* 👤 PROFILE ICON */}
  <div
    onClick={() => navigate("/profile")}
    style={{
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      background: darkMode ? "#1e1e1e" : "#ffffff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      fontSize: "22px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
    }}
  >
    👤
  </div>

  {/* 🌙 THEME BUTTON */}
        <button
    onClick={toggleTheme}
    style={{
      background: "black",
      color: "white",
      border: "none",
      borderRadius: "25px",
      padding: "20px 28px",
      cursor: "pointer",
      fontSize: "28px"
    }}
  >
    {darkMode ? "☀️" : "🌙"}
  </button>

</div>

      </nav>

      {/* 🔥 PAGE CONTENT */}
      <div style={{ marginTop: "120px" }}>
        <Outlet />
      </div>

    </div>
  );
}