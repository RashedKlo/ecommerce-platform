import { HiSearch, HiBell, HiCog, HiUserCircle } from "react-icons/hi";
import { useState } from "react";

function Header({ toggleDarkMode }) {
    const [notifications, setNotifications] = useState([
        { id: 1, message: "New order received", timestamp: "2023-10-01 10:00 AM", read: false },
        { id: 2, message: "Low stock alert for Product A", timestamp: "2023-10-01 09:30 AM", read: true },
    ]);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const markAsRead = (id) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    return (
        <div className="flex justify-between items-center p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-md rounded-lg">
            <h1 className="text-2xl font-bold dark:text-white">Dashboard</h1>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <HiBell className="text-2xl text-gray-500 dark:text-gray-300 cursor-pointer" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                            {unreadCount}
                        </span>
                    )}
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-700 shadow-lg rounded-lg p-4">
                        {notifications.map((n) => (
                            <div key={n.id} className="flex justify-between items-center mb-2">
                                <div>
                                    <p className="text-sm dark:text-white">{n.message}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-300">{n.timestamp}</p>
                                </div>
                                {!n.read && (
                                    <button
                                        onClick={() => markAsRead(n.id)}
                                        className="text-blue-500 text-sm"
                                    >
                                        Mark as Read
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <button
                    onClick={toggleDarkMode}
                    className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                >
                    {localStorage.theme === "dark" ? "🌞" : "🌙"}
                </button>
                <HiCog className="text-2xl text-gray-500 dark:text-gray-300 cursor-pointer" />
                <HiUserCircle className="text-2xl text-gray-500 dark:text-gray-300 cursor-pointer" />
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-2">
                    <HiSearch className="text-gray-500 dark:text-gray-300" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="ml-2 bg-transparent outline-none dark:text-white"
                    />
                </div>
            </div>
        </div>
    );
}

export default Header;