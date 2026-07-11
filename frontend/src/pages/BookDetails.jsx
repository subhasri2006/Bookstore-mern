import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import logo from "../assets/logo.png";
import PDFViewer from "../Components/PDFViewer";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showPreview, setShowPreview] = useState(false);
  const [book, setBook] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  useEffect(() => {
    fetchBook();
    fetchRecommendations();
  }, [id]);

  const fetchBook = async () => {
    try {
      console.log("FETCH BOOK CALLED");
      const res = await API.get(`/books/${id}`);
      setBook(res.data);
      const email = localStorage.getItem("email");

      if (email) {
        await API.post("/interactions", {
          email,
          bookId: res.data._id,
          type: "view"
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const fetchRecommendations = async () => {
  try {
    const res = await API.get(`/recommendations/${id}`);
    setRecommendations(res.data);
    console.log("Recommendations:", res.data);

  } catch (err) {
    console.log(err);
  }
  };

  const addToCart = async () => {
    try {
      const email = localStorage.getItem("email");

      if (!email) {
        alert("Please login first ❌");
        return;
      }

      await API.post("/users/cart", {
        email,
        bookId: book._id
      });

      alert("Added to cart 🛒");
    } catch (err) {
      console.log(err);
      alert("Failed ❌");
    }
  };

  const askAI = () => {
    const response = `This book "${book.title}" is great for beginners and helps you understand core concepts in a simple way.`;
    alert(response);
  };

  if (!book) return <h1 style={{ fontSize: "40px" }}>Loading...</h1>;

  // 🔥 DEBUG LOGS
  console.log("BOOK OBJECT:", book);
  console.log("PDF FIELD:", book?.pdfFile);

  // 🔥 HANDLE MULTIPLE FIELD NAMES
  const pdfFile =
    book?.pdfFile ||
    book?.pdf ||
    book?.pdfUrl ||
    book?.file ||
    "";

  // 🔥 HANDLE LOCAL BACKEND URL (IMPORTANT)
  const finalPdfUrl = pdfFile;

  const originalPrice = book.price + 200;
  const discount = Math.round(
    ((originalPrice - book.price) / originalPrice) * 100
  );
  console.log("recommendations state", recommendations);
  return (
    <>
    <div style={{ fontFamily: "Raleway", background: "#f5f5f5", minHeight: "100vh" }}>

      

      {/* 📘 MAIN */}
      <div
        style={{
          display: "flex",
          gap: "80px",
          padding: "80px",
          background: "white",
          margin: "50px",
          borderRadius: "15px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.15)",
          
        }}
      >

        {/* 📸 IMAGE */}
        <div style={{ flex: 1, textAlign: "center" }}>
          <img
            src={book.image}
            alt="book"
            style={{
              width: "100%",
              maxWidth: "450px",
              height: "auto",
              objectFit: "cover",
              borderRadius: "15px"
            }}
          />
        </div>

        {/* 📄 DETAILS */}
        <div style={{ flex: 2 }}>
          <h1 style={{ fontSize: "48px", marginBottom: "20px" , color:"black" }}>
            {book.title}
          </h1>

          <p style={{ color: "gray", fontSize: "22px" }}>
            by {book.author}
          </p>

          <p style={{ color: "#555", fontSize: "20px" }}>
            Category: {book.category || "Books"}
          </p>
          <div
            style={{
              display: "inline-block",
              background: "#e8f5e9",
              color: "#2e7d32",
              padding: "6px 12px",
              borderRadius: "20px",
              marginTop: "10px",
              fontSize: "14px"
            }}
          >
            ✓ In Stock
          </div>

          {/* 💰 PRICE */}
          <div style={{ marginTop: "25px", display: "flex", gap: "15px", alignItems: "center" }}>
            <h2 style={{ color: "#d87e7c", fontSize: "42px",fontWeight: "700"}}>₹{book.price}</h2>

            <span style={{ textDecoration: "line-through", color: "gray", fontSize: "22px" }}>
              ₹{originalPrice}
            </span>

            <span
              style={{
                background: "#e53935",
                color: "white",
                padding: "6px 12px",
                borderRadius: "5px",
                fontSize: "16px"
              }}
            >
              {discount}% OFF
            </span>
          </div>

          {/* DESCRIPTION */}
          <p style={{ marginTop: "30px", lineHeight: "1.8", fontSize: "20px" }}>
            {book.description || "No description available."}
          </p>

          {/* BUTTONS */}
          <div style={{ marginTop: "30px" }}>
            <button
              onClick={addToCart}
              style={{
                width: "100%",
                padding: "18px",
                background: "#1a237e",
                color: "white",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                borderRadius: "8px"
              }}
            >
              🛒 ADD TO CART
            </button>

            <button
              onClick={() =>
                navigate("/checkout", {
                  state: { book: book }
                })
              }
              style={{
                width: "100%",
                padding: "18px",
                marginTop: "15px",
                background: "#ddd",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                borderRadius: "8px"
              }}
            >
              ❤️ BUY NOW
            </button>
              
            {/* 👁 PREVIEW BUTTON */}
            <button
              onClick={() => {
                if (!pdfFile) {
                  alert("PDF not available ❌");
                  return;
                }
                setShowPreview(true);
              }}
              style={{
                background: "#444",
                color: "white",
                padding: "12px",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                marginTop: "10px"
              }}
            >
              👁 Preview Book
            </button>

            {/* 🔥 PDF VIEWER */}
            {showPreview && pdfFile && (
              <PDFViewer
                file={finalPdfUrl}
                onClose={() => setShowPreview(false)}
              />
            )}
          </div>
        </div>
            </div>

            {/* RECOMMENDED BOOKS */}
            <div
              style={{
                margin: "50px",
                padding: "40px",
                background: "white",
                borderRadius: "15px",
                boxShadow: "0 5px 20px rgba(0,0,0,0.15)"
              }}
            >
              <h2
                style={{
                  fontSize: "32px",
                  marginBottom: "30px",
                  color: "#1a237e",
                  fontWeight: "700"
                }}
              >
                ✨ Books You May Also Like
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: "25px"
                }}
              >
                {recommendations.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => navigate(`/book/${item._id}`)}
                    style={{
                      Width: "180px",
                      background: "white",
                      borderRadius: "15px",
                      overflow: "hidden",
                      cursor: "pointer",
                      boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-8px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0px)";
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: "250px",
                        objectFit: "cover"
                      }}
                    />

                    <div style={{ padding: "15px" }}>
                      <div
                        style={{
                          background: "#4caf50",
                          color: "white",
                          display: "inline-block",
                          padding: "5px 10px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          marginBottom: "10px"
                        }}
                      >
                        {(item.similarity * 100).toFixed(1)}% Match
                      </div>

                      <h3
                        style={{
                          margin: "10px 0",
                          fontSize: "18px",
                          minHeight: "50px"
                        }}
                      >
                        {item.title}
                      </h3>

                      <p
                        style={{
                          color: "#666",
                          fontSize: "14px",
                          marginBottom: "10px"
                        }}
                      >
                        {item.author}
                      </p>

                      <h2
                        style={{
                          color: "#e53935",
                          margin: 0
                        }}
                      >
                        ₹{item.price}
                      </h2>
                    </div>
                  </div>
                ))}
              </div>
            </div>
    </div>
  </>
);
}
{/* RECOMMENDED BOOKS */}
