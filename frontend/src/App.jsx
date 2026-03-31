import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Orders from "./pages/Order";
import BookDetails from "./pages/BookDetails";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import AdminRoute from "./Components/AdminRoute";
import AddBook from "./pages/AddBook";
import UpdateBook from "./pages/UpdateBook";
import DeleteBook from "./pages/DeleteBook";
import OrderDetails from "./pages/OrderDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        <Route path="/book/:id" element={<BookDetails />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* 🔐 Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/add-book"
          element={
            <AdminRoute>
              <AddBook />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/update-book"
          element={
            <AdminRoute>
              <UpdateBook />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/delete-book"
          element={
            <AdminRoute>
              <DeleteBook />
            </AdminRoute>
          }
        />
        <Route
  path="/admin"
  element={
    <AdminRoute>
      
        <Admin />
      
    </AdminRoute>
  }
/>

<Route
  path="/admin/add-book"
  element={
    <AdminRoute>
      
        <AddBook />
      
    </AdminRoute>
  }
/>

<Route
  path="/admin/update-book"
  element={
    <AdminRoute>
      
        <UpdateBook />
      
    </AdminRoute>
  }
/>

<Route
  path="/admin/delete-book"
  element={
    <AdminRoute>
      
        <DeleteBook />
      
    </AdminRoute>
  }
/>


      </Routes>
    </BrowserRouter>
  );
}

export default App;