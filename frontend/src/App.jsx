import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

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
import ReaderPage from "./pages/ReaderPage";
import BottomNavbar from "./Components/BottomNavbar";
import SearchResults from "./pages/SearchResults";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import Layout from "./pages/Layout";
import ChatBot from "./Components/ChatBot";
import Categories from "./pages/Categories";
import CategoryBooks from "./pages/CategoryBooks";
function AppContent() {
  const location = useLocation();

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);

    if (newTheme) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  // ❌ Hide bottom navbar in these pages
  const hideNavbarRoutes = [
    "/",
    "/login",
    "/register",
    "/admin",
    "/admin/add-book",
    "/admin/update-book",
    "/admin/delete-book"
  ];

  return (
    <>
      <Routes>

        {/* 🔐 AUTH */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔥 LAYOUT WRAPPER */}
        <Route
          element={
            <Layout
              toggleTheme={toggleTheme}
              darkMode={darkMode}
            />
          }
        >
          {/* 👤 USER ROUTES */}
          <Route
            path="/home"
            element={
              <HomePage
                darkMode={darkMode}
                toggleTheme={toggleTheme}
              />
            }
          /><Route path="/categories" element={<Categories darkMode={darkMode} />} />
          <Route path="/categories/:category"element={<CategoryBooks darkMode={darkMode} />}/>
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/read/:id" element={<ReaderPage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* 👑 ADMIN */}
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

      {/* 🔻 BOTTOM NAVBAR */}
      {!hideNavbarRoutes.includes(location.pathname) && (
        <BottomNavbar />
      )}
    <ChatBot darkMode={darkMode}/>
    </>
  );
}

// 🔥 MAIN APP
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;