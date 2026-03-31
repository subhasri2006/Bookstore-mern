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

  if (!order) return <p>Loading...</p>;

  return (
    <div>
      <h2>Order Details</h2>

      <p>Order ID: {order._id}</p>
      <p>Total: ₹{order.total}</p>

      <h3>Items:</h3>

      {order.items.map((item, index) => (
        <div key={index} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
          <p>{item.title}</p>
          <p>Price: ₹{item.price}</p>
          <p>Quantity: {item.quantity}</p>
        </div>
      ))}
    </div>
  );
};

export default OrderDetails;