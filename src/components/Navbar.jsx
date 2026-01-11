import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md px-6 py-4 sticky top-0 z-50">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-orange-600">
          Italica
        </Link>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-2xl" onClick={() => setOpen(!open)}>
          ☰
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8">
          <Link to="/" className="hover:text-orange-600">
            Home
          </Link>
          <Link to="/about" className="hover:text-orange-600">
            About
          </Link>
          <Link to="/menu" className="hover:text-orange-600">
            Menu
          </Link>
          <Link to="/contact" className="hover:text-orange-600">
            Contact
          </Link>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="flex flex-col mt-3 md:hidden gap-3">
          <Link to="/" className="hover:text-orange-600">
            Home
          </Link>
          <Link to="/about" className="hover:text-orange-600">
            About
          </Link>
          <Link to="/menu" className="hover:text-orange-600">
            Menu
          </Link>
          <Link to="/contact" className="hover:text-orange-600">
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
}
