import { useEffect, useState } from "react";
import API from "../api";

export default function Wishlist() {
  const [books, setBooks] = useState([]);
  const email = localStorage.getItem("email");

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await API.get(`/users/wishlist/${email}`);
      setBooks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>❤️ My Wishlist</h2>

      {books.length === 0 ? (
        <p>No wishlist items</p>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px"
        }}>
          {books.map((b) => (
            <div key={b._id} style={{
              padding: "20px",
              border: "1px solid #ccc",
              borderRadius: "10px",
              textAlign: "center"
            }}>
              <img src={b.image} style={{ width: "120px" }} />
              <h4>{b.title}</h4>
              <p>₹{b.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}