import React, { act, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FiSearch,
    FiCalendar,
    FiFilter,
    FiDownload,
    FiPlus,
    FiEye,
    FiEdit2,
    FiTrash2,
    FiChevronUp,
    FiChevronDown,
    FiX,
    FiUser
} from "react-icons/fi";
import { AXIOS } from "../../Api/MyAxios";
import { ALLORDERS, BASEURL, DELETEORDER, EXPORTORDERS, FILTERCATEGORIES, FILTERORDERS } from "../../Api/Api";
function Orders() {

    const [sortColumn, setSortColumn] = useState("orderDate");
    const [sortDirection, setSortDirection] = useState("desc");
    const [activePage, setActivePage] = useState(1);
    const [Loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [Orders, setOrders] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [filterType, setFilterType] = useState("username");

    const [total, setTotal] = useState(0);
    const nav = useNavigate();

    const statuses = {
        1: { color: "bg-yellow-200 text-yellow-800", status: "New" },
        3: { color: "bg-green-200 text-green-800", status: "Completed" },
        2: { color: "bg-red-200 text-red-800", status: "Cancelled" }
    };
    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid date';

        const options = { year: 'numeric', month: 'short', day: '2-digit' };
        return date.toLocaleDateString(undefined, options);
    };
    let ItemsPerPage = 10;
    let Pages = Math.ceil(total / ItemsPerPage);
    useEffect(() => {
        if (search) {
            const timeoutId = setTimeout(() => {
                getSearchResults();

            }, 500);  // Debounce delay
            return () => clearTimeout(timeoutId);
        }
        else

            getOrders();
    }, [search, activePage]);

    async function getOrders() {
        try {
            setLoading(true);
            let res = await AXIOS.get(`${BASEURL}/${ALLORDERS}?pageNumber=${activePage}&limitOfOrders=${ItemsPerPage}`);
            setTotal(res.data.total);
            setOrders(res.data.data);
            console.log(res.data.data);

        }
        catch (err) {
            console.log(err);

            setOrders([]);


        }
        finally {
            setLoading(false);
        }
    }

    // modify it

    async function getSearchResults() {
        if (search.trim().length == 0)
            return;
        try {
            setLoading(true);
            let res = await AXIOS.get(`${BASEURL}/${FILTERORDERS}=${filterType}&value=${search}&pageNumber=${activePage}&LimitOfOrders=${ItemsPerPage}`);
            setTotal(res.data.total);
            setOrders(res.data.data);
        }
        catch (err) {
            console.log(err?.response);
            if (err?.response.status == 404) {
                setOrders([]);
            }
        }
        finally {
            setLoading(false);
        }
    }





    const handleExport = async () => {
        try {
            const response = await AXIOS.get(`${BASEURL}/${EXPORTORDERS}?pageNumber=${activePage}&limitOfOrders=${ItemsPerPage}`, {
                responseType: "blob",
            });

            if (!response || !response.data) {
                throw new Error("No data received from the server.");
            }

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "orders.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        catch (error) {
            console.error("Error exporting orders:", error.response?.data || error.message);
            alert("Failed to export orders. Please try again.");
        }
        finally {
            // Ensure cleanup of created object URL
            setTimeout(() => window.URL.revokeObjectURL(url), 100);
        }
    };
    const handleSort = (column) => {
        setSortColumn(column);
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    };
    const sortedOrders = [...Orders].sort((a, b) => {
        const valA = a[sortColumn].toLowerCase();
        const valB = b[sortColumn].toLowerCase();
        if (valA < valB) return sortDirection === "asc" ? -1 : 1;
        if (valA > valB) return sortDirection === "asc" ? 1 : -1;
        return 0;
    });
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };
    async function handleDelete(ID) {
        try {
            setLoading(true);
            let res = await AXIOS.delete(`${BASEURL}/${DELETEORDER}/${ID}`);
            setOrders(Orders.filter((Order) => Order.orderID != ID));
        }
        catch (err) {
            console.log(err);
        }
        finally {
            setLoading(false);
        }
    }
    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="flex justify-between items-center bg-white   rounded-lg mb-3">
                {/* Left Side: Breadcrumbs */}
                <div>
                    <h1 className="text-lg font-semibold text-gray-800">Orders</h1>
                    <div className="text-sm text-gray-500">
                        <Link to="/dashboard" className="hover:text-primary">
                            Dashboard
                        </Link>{" "}
                        &gt;
                        <span className="text-primary">Orders</span>
                    </div>
                </div>

                {/* Right Side: Export and Add Order Buttons */}
                <div className="flex items-center space-x-2">
                    <button onClick={handleExport}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary text-white hover:bg-gray-100 hover:text-gray-700 rounded-lg text-sm font-medium transition-all duration-300">
                        <FiDownload className="w-5 h-5" />
                        <span>Export</span>
                    </button>

                </div>
            </div>

            {/* Search and Filters Section */}
            <div className="py-4 flex flex-wrap justify-start items-center bg-white rounded-lg mb-3 gap-4">
                {!showFilters ? (
                    <button
                        onClick={() => { setShowFilters(true); setActivePage(1) }}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-primary hover:text-white rounded-lg text-sm font-medium transition-all duration-300"
                    >
                        <FiFilter className="w-5 h-5" />
                        <span>Filters</span>
                    </button>
                ) : (
                    <div className="flex justify-center items-center gap-3">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-1 py-1 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none"
                        >
                            <option value="username" >Customer</option>
                            <option value="orderstatus">Status</option>

                        </select>
                        {filterType == "username" ?
                            <div className="relative flex-grow md:flex-grow-0 w-full md:w-auto">
                                <FiSearch className="absolute top-2.5 left-3 text-gray-400" />

                                <input
                                    type="text"
                                    placeholder={`Search by ${filterType}...`}
                                    value={search}
                                    onChange={handleSearchChange}
                                    className="w-full md:w-72 pl-10 pr-2 py-1 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none"
                                />
                            </div> :
                            <select
                                value={search}
                                onChange={handleSearchChange}
                                className="px-2 py-1 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none"
                            >
                                <option value="" disabled>Select Status</option>
                                <option value="1" >New</option>
                                <option value="2">Cancelled</option>
                                <option value="3">Completed</option>

                            </select>
                        }
                        <button
                            onClick={() => { setShowFilters(false); setActivePage(1); setSearch("") }}
                            className="px-2 py-1 bg-red-500 text-white rounded-lg text-sm font-medium transition-all duration-300"
                        >
                            <FiX className="h-6 w-6" />
                        </button>
                    </div>
                )}
            </div>

            <div className="shadow-md ">
                {/* Categories Table */}
                <div className="bg-white  rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left text-gray-700">
                        <thead className="bg-gray-100">
                            <tr>
                                {[
                                    { key: "userName", label: "Customer" },
                                    { key: "orderID", label: "Order" },
                                    { key: "orderStatus", label: "Status" },
                                    { key: "paymentMethod", label: "Payment Method" },
                                    { key: "totalAmount", label: "TotalAmount" },
                                    { key: "discount", label: "Discount" },
                                    { key: "orderDate", label: "OrderDate" },
                                    { key: "action", label: "Action", sortable: false }].map(({ key, label, sortable = true }) => (
                                        <th
                                            key={key}
                                            className={`px-4 py-3 cursor-pointer`}
                                            onClick={sortable ? () => handleSort(key) : undefined}
                                        >
                                            <div className="flex items-center">
                                                {label}
                                                {sortable && (
                                                    <span className="ml-1">
                                                        {sortDirection === "asc" ? (
                                                            <FiChevronUp className="w-4 h-4" />
                                                        ) : (
                                                            <FiChevronDown className="w-4 h-4" />
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                    ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Loading ? (
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
                            ) : sortedOrders.length <= 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                                        <div className="flex flex-col items-center space-y-2">
                                            <FiSearch className="w-12 h-12 text-gray-300" />
                                            <span className="text-lg font-medium">No results found</span>
                                            <p className="text-sm text-gray-400">
                                                Try adjusting your search or filters to find what you're looking for.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) :
                                (
                                    sortedOrders.map((order, index) => (
                                        <tr key={index} className="border-t hover:bg-gray-50">

                                            <td className="px-4 py-3">{order.userName}</td>
                                            <td className="px-4 py-3">{order.orderID}</td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${statuses[order.orderStatus].color}`}
                                                >
                                                    {statuses[order.orderStatus].status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">{order.paymentMethod}</td>
                                            <td className="px-4 py-3">{order.totalAmount}</td>
                                            <td className="px-4 py-3">{order.discount}</td>
                                            <td className="px-4 py-3">{formatDate(order.orderDate)}</td>
                                            <td className="relative space-x-2">
                                                <FiEye onClick={() => nav(`/dashboard/orders/${order.orderID}/${order.userName}`)} className="absolute top-[calc(50%-8px)] left-2 text-blue-500 cursor-pointer hover:scale-110 transition-transform" />
                                                <FiUser onClick={() => nav(`/dashboard/customers/customer/${order.userID}`)} className="absolute top-[calc(50%-8px)] left-6 text-green-500 cursor-pointer hover:scale-110 transition-transform" />
                                                <FiTrash2 onClick={() => handleDelete(order.orderID)} className="absolute top-[calc(50%-8px)] left-12 text-red-500 cursor-pointer hover:scale-110 transition-transform" />
                                            </td>
                                        </tr>
                                    ))
                                )
                            }
                        </tbody>


                    </table>
                </div>

                {/* Footer Section */}



                {total > ItemsPerPage && (
                    <div className="flex flex-wrap justify-between items-center bg-white p-4 border rounded-lg shadow-sm">
                        <div className="text-sm text-gray-500">
                            Showing {(activePage - 1) * ItemsPerPage + 1}-{Math.min(activePage * ItemsPerPage, total)} of {total}
                        </div>
                        <div className="flex items-center space-x-1">
                            {/* Previous Button */}
                            <button
                                className="px-2 py-1 rounded-lg text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                                disabled={activePage === 1}
                                onClick={() => setActivePage((prev) => prev - 1)}
                            >
                                &lt;
                            </button>

                            {/* Page Buttons Logic */}
                            {Array.from({ length: Math.min(Pages, 5) }, (_, i) => {
                                let pageNumber = 1;
                                if (activePage <= 3) {
                                    pageNumber = i + 1;
                                } else if (activePage > Pages - 3) {
                                    pageNumber = Pages - 4 + i;
                                } else {
                                    pageNumber = activePage - 2 + i;
                                }

                                if (pageNumber <= 0 || pageNumber > Pages) return null;
                                return (
                                    <button
                                        key={i}
                                        className={`px-3 py-1 rounded-lg ${activePage === pageNumber
                                            ? "bg-primary text-white"
                                            : "text-gray-700 hover:bg-gray-100"
                                            }`}
                                        onClick={() => setActivePage(pageNumber)}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            })}

                            {/* Ellipsis for More Pages */}
                            {activePage < Pages - 2 && Pages > 5 && (
                                <>
                                    <span className="px-2 text-gray-500">...</span>
                                    <button
                                        className="px-3 py-1 rounded-lg text-gray-700 hover:bg-gray-100"
                                        onClick={() => setActivePage(Pages)}
                                    >
                                        {Pages}
                                    </button>
                                </>
                            )}

                            {/* Next Button */}
                            <button
                                className="px-2 py-1 rounded-lg text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                                disabled={activePage === Pages}
                                onClick={() => setActivePage((prev) => prev + 1)}
                            >
                                &gt;
                            </button>
                        </div>
                    </div>
                )}



            </div>

        </div >
    );
}

export default Orders;