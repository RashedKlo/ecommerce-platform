import { useState } from "react";
import {
    FiMenu,
    FiX,
    FiBell,
    FiUser,
    FiSearch,
    FiChevronDown,
} from "react-icons/fi";
import Cookie from 'cookie-universal'
function Topbar({ sidebarOpen, toggleSidebar }) {
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const cookie = Cookie();
    const userName = cookie.get("currentUser").userName;
    const role = cookie.get("currentUser").role || "Admin";
    return (
        <div
            className={`relative flex justify-between items-center  bg-gradient-to-r to-blue-500 from-primary shadow-lg  top-0 z-20 duration-300 p-2 pr-12 w-full`}
        >
            {/* Sidebar Toggle Icon */}
            <div
                className="cursor-pointer text-white hover:bg-primary p-2 rounded-full "
                onClick={toggleSidebar}
            >
                {sidebarOpen ? (
                    <FiX className="h-6 w-6" /> // Close Icon
                ) : (
                    <FiMenu className="h-6 w-6" /> // Menu Icon
                )}
            </div>

            {/* Center Section with Search Bar */}
            <div className="flex-1 mx-6 hidden md:block">
                <div className="relative">
                    <FiSearch className="absolute top-2.5 left-3 text-blue-200" />
                    <input
                        type="text"
                        placeholder="Search for something..."
                        className="w-full max-w-lg pl-10 pr-4 py-2 rounded-full bg-blue-100 text-gray-700 border-none focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    />
                </div>
            </div>

            {/* Right Section with Icons */}
            <div className="flex items-center space-x-2">
                {/* Notification Icon */}
                <div className="relative cursor-pointer">
                    <FiBell className="h-6 w-6 text-white hover:text-blue-200" />
                    <span className="absolute -top-1 left-3 text-xs bg-red-500 text-white rounded-full w-3 h-3 flex items-center justify-center animate-pulse">
                    </span>
                </div>

                {/* Profile and Dropdown */}
                <div className="relative">
                    <div
                        className="flex items-center space-x-2 cursor-pointer mr-10"
                        onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    >
                        <FiUser className="h-8 w-8 text-white hover:text-blue-200" />
                        <div className="hidden sm:block text-white">
                            <p className="text-sm font-semibold">{userName}</p>
                            <p className="text-xs text-blue-200">{role}</p>
                        </div>
                        <FiChevronDown
                            className={`h-5 w-5 text-white transition-transform duration-300 ${profileDropdownOpen ? "rotate-180" : ""
                                }`}
                        />
                    </div>

                    {/* Dropdown Menu */}
                    {profileDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                            <a
                                href="/dashboard/profile"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100"
                            >
                                Profile
                            </a>
                            <a
                                href="/settings"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100"
                            >
                                Settings
                            </a>
                            <a
                                href="/logout"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100"
                            >
                                Logout
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Topbar;
