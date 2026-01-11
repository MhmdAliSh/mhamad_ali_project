import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartBadge from "./components/CartBadge";

import Home from "./pages/Home";
import About from "./pages/About";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import TrackOrder from "./pages/TrackOrder";
import Admin from "./pages/Admin";

function App() {
  const location = useLocation();
  const isAdmin = location.pathname === "/admin";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {!isAdmin && <Navbar />}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/track" element={<TrackOrder />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      {!isAdmin && <CartBadge />}

      {!isAdmin && <Footer />}
    </div>
  );
}

export default App;
