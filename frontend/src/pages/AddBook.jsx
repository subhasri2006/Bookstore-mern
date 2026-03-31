import { useState } from "react";
import logo from "../assets/logo.png";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function AddBook() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "",
    pdfFile: "",
    isbn: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/books", form);
      alert("Book added successfully 🎉");
      navigate("/admin");
    } catch (err) {
      console.log(err);
      alert("Error adding book ❌");
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
          <b>Admin Panel</b>
        </div>

        <div>
          <span onClick={() => navigate("/admin")} style={{ margin: "10px", cursor: "pointer" }}>
            Dashboard
          </span>
          <span onClick={() => navigate("/home")} style={{ margin: "10px", cursor: "pointer" }}>
            Home
          </span>
        </div>
      </div>

      {/* 📦 CENTER CONTAINER */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "90vh"
      }}>

        {/* 🧾 FORM CARD */}
        <div style={{
          width: "100%",
          maxWidth: "500px",
          padding: "25px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          backgroundColor: "#fff"
        }}>
          
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Add Book
          </h2>

          <form onSubmit={handleSubmit}>

            {[
              { name: "title", placeholder: "Title" },
              { name: "author", placeholder: "Author" },
              { name: "description", placeholder: "Description" },
              { name: "price", placeholder: "Price", type: "number" },
              { name: "category", placeholder: "Category" },
              { name: "stock", placeholder: "Stock", type: "number" },
              { name: "image", placeholder: "Image URL" },
              { name: "pdfFile", placeholder: "PDF URL" },
              { name: "isbn", placeholder: "ISBN" }
            ].map((field, index) => (
              <input
                key={index}
                name={field.name}
                type={field.type || "text"}
                placeholder={field.placeholder}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "12px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  outline: "none"
                }}
              />
            ))}

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "black",
                color: "#FFD300",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
                marginTop: "10px"
              }}
            >
              Add Book
            </button>

          </form>
        </div>
      </div>

      {/* 🔻 FOOTER */}
      <div style={{
        backgroundColor: "black",
        color: "#FFD300",
        padding: "15px",
        textAlign: "center"
      }}>
        Admin Footer
      </div>

    </div>
  );
}