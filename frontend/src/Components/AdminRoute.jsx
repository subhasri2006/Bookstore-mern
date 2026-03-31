import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const email = localStorage.getItem("email");

  const ADMIN_EMAIL = "subhasri4844@gmail.com";

  if (!email || email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    return <Navigate to="/home" />;
  }

  return children;
}