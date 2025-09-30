import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    FiUser,
    FiMail,
    FiPhone,
    FiMapPin,
    FiCreditCard,
    FiCalendar,
    FiFilter,
    FiSearch,
    FiGlobe,
    FiChevronUp,
    FiChevronDown
} from "react-icons/fi";
import { BASEURL, GETUSER, ALLORDERS, ALLORDERDETAILS } from "../../Api/Api";
import { AXIOS } from "../../Api/MyAxios";
import Cookie from 'cookie-universal'
const ItemsPerPage = 5;

function Profile() {
    const cookie = Cookie();
    const userID = cookie.get("currentUser").userID;
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activePage, setActivePage] = useState(1);
    const [totalOrdersCount, setTotalOrdersCount] = useState(0);

    const statuses = {
        Processing: "bg-yellow-200 text-yellow-800",
        Completed: "bg-green-200 text-green-800",
        Canceled: "bg-red-200 text-red-800",
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    // Combined fetch function
    const fetchData = async () => {
        if (!userID) {
            console.error("User ID not found in URL.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const userRes = await AXIOS.get(`${BASEURL}/${GETUSER}/${userID}`);
            const ordersRes = await AXIOS.get(`${BASEURL}/${ALLORDERS}?userID=${userID}&pageNumber=${activePage}&limitOfOrders=${ItemsPerPage}`);

            setUser(userRes.data);
            setOrders(ordersRes.data.data);
            setTotalOrdersCount(orders.length);

        } catch (err) {
            console.error("Error fetching data:", err);
            // In a real app, you might set an error state here
            setUser(null);
            setStats(null);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on component mount and when activePage changes
    useEffect(() => {
        fetchData();
    }, [userID, activePage]);

    let totalAmount = 0;
    for (const order of orders) {
        // Remove the '$' and convert to a number
        const amount = parseFloat(order.totalAmount);
        // Add the amount to the total
        totalAmount += amount;
    }
    // totalAmount now holds the sum of all orders // The `0` here is the initial value for the accumulator
    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <div className="flex flex-wrap items-center justify-center md:flex-nowrap gap-6">

                {/* Left Side: Profile Info Box */}
                <div className="w-full md:w-1/3 bg-white shadow-md rounded-lg p-6 relative">
                    <div className="absolute top-[-25px] left-1/2 transform -translate-x-1/2 w-32 h-32 bg-white rounded-full border-4 border-primary flex items-center justify-center">
                        <FiUser className="text-primary text-6xl" />
                    </div>
                    <div className="mt-20 text-center">
                        <h2 className="text-xl font-semibold text-gray-800">{user?.userName || "Loading..."}</h2>
                        <hr className="my-4" />
                        <div className="space-y-4 text-left">
                            <div className="flex items-center space-x-2">
                                <FiUser className="text-blue-500 w-5 h-5" />
                                <div>
                                    <p className="text-sm text-gray-500">User ID</p>
                                    <p className="font-medium text-gray-800">{user?.userID || "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <FiMail className="text-green-500 w-5 h-5" />
                                <div>
                                    <p className="text-sm text-gray-500">Billing Email</p>
                                    <p className="font-medium text-gray-800">{user?.email || "N/A"}</p>
                                </div>
                            </div>
                            {/* Updated to Birth Date */}
                            <div className="flex items-center space-x-2">
                                <FiCalendar className="text-yellow-500 w-5 h-5" />
                                <div>
                                    <p className="text-sm text-gray-500">Birth Date</p>
                                    <p className="font-medium text-gray-800">{formatDate(user?.birthDate) || "N/A"}</p>
                                </div>
                            </div>
                            {/* Updated to Country */}
                            <div className="flex items-center space-x-2">
                                <FiGlobe className="text-red-500 w-5 h-5" />
                                <div>
                                    <p className="text-sm text-gray-500">Country</p>
                                    <p className="font-medium text-gray-800">{user?.country.country || "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <FiCreditCard className="text-purple-500 w-5 h-5" />
                                <div>
                                    <p className="text-sm text-gray-500">Latest Transaction</p>
                                    <p className="font-medium text-gray-800">{orders[0]?.orderID || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Stats and Table */}
                <div className="w-full md:w-2/3 space-y-6">
                    {/* Stats Boxes */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { name: "Total Balance", icon: FiCreditCard, value: totalAmount || "N/A" },
                            { name: "Total Orders", icon: FiCalendar, value: orders.length || "N/A" }, // Updated to use totalOrdersCount
                            { name: "Rewards Points", icon: FiFilter, value: stats?.RewardsPoints || "0" },
                        ].map((box, index) => (
                            <div key={index} className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center space-y-4 text-center">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                    <box.icon className="text-primary w-6 h-6" />
                                </div>
                                <p className="text-sm font-semibold text-gray-600">{box.name}</p>
                                <p className="text-lg font-bold text-gray-800">{box.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Transactions Table */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="flex justify-between items-center px-4 py-3">
                            <h2 className="font-semibold text-gray-800">Transaction History</h2>
                            <div className="flex items-center space-x-2">
                                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-primary hover:text-white rounded-lg text-sm font-medium transition-all duration-300">
                                    <FiCalendar className="w-5 h-5" />
                                    <span>Select Dates</span>
                                </button>
                                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-primary hover:text-white rounded-lg text-sm font-medium transition-all duration-300">
                                    <FiFilter className="w-5 h-5" />
                                    <span>Filters</span>
                                </button>
                            </div>
                        </div>
                        <table className="w-full text-sm text-left text-gray-700">
                            <thead className="bg-gray-100">
                                <tr>
                                    {[
                                        { key: "orderID", label: "Order" },
                                        { key: "orderStatus", label: "Status" },
                                        { key: "paymentMethod", label: "Payment Method" },
                                        { key: "totalAmount", label: "TotalAmount" },
                                        { key: "discount", label: "Discount" },
                                        { key: "orderDate", label: "OrderDate" },
                                        { key: "action", label: "Action", sortable: false }
                                    ].map(({ key, label }) => (
                                        <th key={key} className={`px-4 py-3`}>
                                            <div className="flex items-center">
                                                {label}
                                                {key !== "action" && (
                                                    <span className="ml-1">
                                                        <FiChevronDown className="w-4 h-4" />
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-6 text-center">
                                            <div className="flex flex-col items-center space-y-2">
                                                <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                                </svg>
                                                <span className="text-gray-500">Loading Orders...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : orders.length <= 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                                            <div className="flex flex-col items-center space-y-2">
                                                <FiSearch className="w-12 h-12 text-gray-300" />
                                                <span className="text-lg font-medium">No results found</span>
                                                <p className="text-sm text-gray-400">Try adjusting your search or filters to find what you're looking for.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order, index) => (
                                        <tr key={index} className="border-t hover:bg-gray-50">
                                            <td className="px-4 py-3">{order.orderID}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 text-xs rounded-full ${statuses[order.orderStatus]}`}>
                                                    {order.orderStatus}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">{order.paymentMethod}</td>
                                            <td className="px-4 py-3">{order.totalAmount}</td>
                                            <td className="px-4 py-3">{order.discount}</td>
                                            <td className="px-4 py-3">{formatDate(order.orderDate)}</td>
                                            <td className="px-4 py-3">
                                                <button className="text-blue-500 hover:underline">View</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>


                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;