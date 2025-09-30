import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineShoppingCart,
  HiOutlineSearch,
  HiMenu,
  HiX,
} from "react-icons/hi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="bg-white shadow-lg px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-xl font-bold">
            <NavLink to="/home">
              <img
                src="/assets/Logo.png"
                alt="Logo"
                width="133px"
                height="44px"
                className="hover:scale-105 transition-transform duration-300"
              />
            </NavLink>
          </div>

          {/* Hamburger Menu (Mobile) */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md border border-gray-300 shadow-sm hover:bg-gray-100 transition-transform duration-300"
            >
              {isOpen ? (
                <HiX size={24} className="text-gray-700" />
              ) : (
                <HiMenu size={24} className="text-gray-700" />
              )}
            </button>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8">
            {["HOME", "SHOP", "CATEGORIES", "CONTACT"].map(
              (link) => (
                <NavLink
                  key={link}
                  to={`/${link.toLowerCase()}`}
                  className={({ isActive }) =>
                    `text-lg font-medium font-Poppins-ExtraLightItalic transition-colors duration-300 ${isActive
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 border-b-2 border-blue-500"
                      : "text-gray-700 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500"
                    }`
                  }
                >
                  {link}
                </NavLink>
              )
            )}
          </div>

          {/* Right Icons */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Search Icon */}
            <HiOutlineSearch
              size={20}
              className="text-gray-700 hover:text-blue-500 transition-transform duration-300 hover:scale-110 cursor-pointer"
            />

            {/* User Profile */}
            <div className="flex items-center space-x-1">
              <HiOutlineUser size={20} className="text-gray-700" />
              <NavLink
                to="/profile/12"
                className="text-gray-700  hover:text-blue-500 transition duration-300 font-medium"
              >
                My Profile
              </NavLink>
            </div>

            {/* Cart Icon with Badge */}
            <NavLink to="/cart" className="relative">
              <HiOutlineShoppingCart
                size={24}
                className="text-gray-700 hover:text-blue-500 transition-transform duration-300 hover:scale-110"
              />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-bounce">
                3
              </span>
            </NavLink>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-4 animate-slideDown origin-top transition-transform duration-300">
            {["HOME", "SHOP", "CATEGORIES", "CONTACT","CART","DASHBOARD"].map(
              (link) => (
                <NavLink
                  key={link}
                  to={`/${link.toLowerCase()}`}
                  className={({ isActive }) =>
                    `block text-lg font-medium pl-3 ${isActive
                      ? "text-blue-500 border-l-4 border-blue-500"
                      : "text-gray-700 hover:text-blue-500 transition-colors duration-300"
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {link}
                </NavLink>
              )
            )}
          </div>
        )}
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;
