import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api";
import noImage from "../assets/no-image.jpg";

export default function SearchResults() {
  const [books, setBooks] = useState([]);
  const [sort, setSort] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    fetchResults();
  }, [query, sort]);

  const fetchResults = async () => {
    try {
      const res = await API.get(`/books/search?q=${query}`);
      let data = res.data;

      // 🔥 SORTING
      if (sort === "low") {
        data = data.sort((a, b) => a.price - b.price);
      } else if (sort === "high") {
        data = data.sort((a, b) => b.price - a.price);
      }

      setBooks(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: "120px 40px" }}>

      {/* 🔍 TITLE */}
      <h2 style={{ marginBottom: "20px" }}>
           Results for "{query}" ({books.length} books)
      </h2>

      {/* 🔽 SORT */}
      <div style={{ marginBottom: "20px" }}>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{ padding: "10px" }}
        >
          <option value="">Sort By</option>
          <option value="low">Price: Low → High</option>
          <option value="high">Price: High → Low</option>
        </select>
      </div>

      {/* 📚 RESULTS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "40px"
      }}>
        {books.length === 0 ? (
          <p>No books found 😢</p>
        ) : (
          books.map((b) => (
            <div
              key={b._id}
              onClick={() => navigate(`/book/${b._id}`)}
              style={{
                borderRadius: "15px",
                padding: "20px",
                background: "white",
                boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
                cursor: "pointer"
              }}
            >

              {/* IMAGE */}
              <div style={{
                height: "250px",
                background: "#f5f5f5",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "10px",
                marginBottom: "10px"
              }}>
                <img
                  src={b.image}
                  alt=""
                  onError={(e) => (e.target.src = noImage)}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain"
                  }}
                />
              </div>

              <p
                style={{
                  color: "#666",
                  marginTop: "5px"
                }}
              >
                ✍️ {b.author}
              </p>

              <p
                style={{
                  color: "#1a237e",
                  fontWeight: "bold"
                }}
              >
                📚 {b.category}
              </p>
              <p style={{ fontWeight: "bold" }}>₹{b.price}</p>

            </div>
          ))
        )}
      </div>

    </div>
  );
}