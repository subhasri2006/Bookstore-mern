import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UpdateBook() {
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:5000/api/books/${id}`, formData);
      alert("Updated ✅");
      navigate("/admin");
    } catch (err) {
      console.log(err);
      alert("Error updating");
    }
  };

  return (
    <div>

      {/* NAVBAR */}
      <nav style={navStyle}>
        <h2>📚 Bookish Admin</h2>
        <div>
          <button onClick={() => navigate("/admin")}>Dashboard</button>
          <button onClick={() => navigate("/admin/add-book")}>Add</button>
          <button onClick={() => navigate("/admin/update-book")}>Update</button>
          <button onClick={() => navigate("/admin/delete-book")}>Delete</button>
        </div>
      </nav>

      <div style={containerStyle}>
        <form onSubmit={handleUpdate} style={formStyle}>
          <h2>Update Book</h2>

          <input placeholder="Book ID" value={id} onChange={(e) => setId(e.target.value)} style={inputStyle} required />

          <input name="title" placeholder="Title" onChange={handleChange} style={inputStyle} />
          <input name="author" placeholder="Author" onChange={handleChange} style={inputStyle} />
          <input name="price" placeholder="Price" onChange={handleChange} style={inputStyle} />
          <textarea name="description" placeholder="Description" onChange={handleChange} style={inputStyle} />
          <input name="image" placeholder="Image URL" onChange={handleChange} style={inputStyle} />

          <button type="submit" style={buttonStyle}>Update Book</button>
        </form>
      </div>

    </div>
  );
}

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "15px",
  background: "#FFD300"
};

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  marginTop: "40px"
};

const formStyle = {
  width: "400px",
  padding: "20px",
  background: "#fff",
  borderRadius: "10px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.2)"
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "8px 0",
  borderRadius: "5px",
  border: "1px solid #ccc"
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  background: "#FFD300",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold"
};