import React, { useState } from "react";
import { Truck, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button.tsx";
import logo from '../pages/logo.jpg';

const Header = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  return (
    <div>
      <nav className="bg-blue-400 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex items-center space-x-2">
              <img src={logo} alt="" className="h-12 w-14"/>
              <span className="text-xl font-bold text-gray-900">
                <a href="/">FreightMe</a>
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {/* <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a> */}
              {/* <a href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</a> */}
              <a href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700 focus:outline-none">
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden px-4 pb-4 space-y-3">
            {/* <a href="#features" className="block text-gray-700 hover:text-blue-600">Features</a> */}
            {/* <a href="/contact" className="block text-gray-700 hover:text-blue-600">Pricing</a> */}
            <a href="/contact" className="block text-gray-700 hover:text-blue-600">Contact</a>
            <button
              onClick={handleLogout}
              className="block w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Header;
