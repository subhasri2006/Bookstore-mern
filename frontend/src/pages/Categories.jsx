import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await API.get("/books/categories");
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      style={{
        padding: "120px 50px",
        minHeight: "100vh"
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "50px"
        }}
      >
        📚 Book Categories
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "30px"
        }}
      >
        {categories.map((cat, index) => (
          <div
            key={index}
            onClick={() =>
              navigate(`/categories/${encodeURIComponent(cat)}`)
            }
            style={{
              background: "#FFD300",
              padding: "40px",
              borderRadius: "20px",
              textAlign: "center",
              cursor: "pointer",
              fontSize: "24px",
              fontWeight: "bold"
            }}
          >
            {cat}
          </div>
        ))}
      </div>
    </div>
  );
}