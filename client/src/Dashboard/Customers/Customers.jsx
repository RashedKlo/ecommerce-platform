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
    FiX
} from "react-icons/fi";
import { AXIOS } from "../../Api/MyAxios";
import { ALLCUSTOMERS, BASEURL, DELETECUSTOMER, FILTERCUSTOMERS, EXPORTCUSTOMERS } from "../../Api/Api";
function Customers() {

    const [sortColumn, setSortColumn] = useState("createdAt");
    const [sortDirection, setSortDirection] = useState("desc");
    const [activePage, setActivePage] = useState(1);
    const [filterType, setFilterType] = useState("customer");
    const [showFilters, setShowFilters] = useState(false);

    const [Loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [Customers, setCustomers] = useState([]);
    const [total, setTotal] = useState(0);
    const nav = useNavigate();
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

            getCustomers();
    }, [search, activePage]);

    async function getCustomers() {
        try {
            setLoading(true);
            let res = await AXIOS.get(`${BASEURL}/${ALLCUSTOMERS}?pageNumber=${activePage}&limitOfUsers=${ItemsPerPage}`);
            setTotal(res.data.total);
            setCustomers(res.data.data);
        }
        catch (err) {
            console.log(err);
            if (err?.response.status == 404) {
                setCustomers([]);
            }

        }
        finally {
            setLoading(false);
        }
    }



    async function getSearchResults() {
        if (search.trim().length == 0)
            return;
        try {
            setLoading(true);
            let res = await AXIOS.get(`${BASEURL}/${FILTERCUSTOMERS}=${search}&pageNumber=${activePage}&limitOfUsers=${ItemsPerPage}`);
            setTotal(res.data.total);
            setCustomers(res.data.data);
        }
        catch (err) {
            console.log(err?.response);
            if (err?.response.status == 404) {
                setCustomers([]);
            }
        }
        finally {
            setLoading(false);
        }
    }






    const handleExport = async () => {
        try {
            const response = await AXIOS.get(`${BASEURL}/${EXPORTCUSTOMERS}?pageNumber=${activePage}&limitOfUsers=${ItemsPerPage}`, {
                responseType: "blob",
            });

            if (!response || !response.data) {
                throw new Error("No data received from the server.");
            }

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "customers.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        catch (error) {
            console.error("Error exporting customers:", error.response?.data || error.message);
            alert("Failed to export customers. Please try again.");
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
    const sortedCustomers = [...Customers].sort((a, b) => {
        const valA = (sortColumn === "country" ? a["country"].country : a[sortColumn]).toLowerCase();
        const valB = (sortColumn === "country" ? b["country"].country : b[sortColumn]).toLowerCase();
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
            let res = await AXIOS.delete(`${BASEURL}/${DELETECUSTOMER}/${ID}`);
            setCustomers(Customers.filter((customer) => customer.userID != ID));
            console.log(res);
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
                    <h1 className="text-lg font-semibold text-gray-800">Customers</h1>
                    <div className="text-sm text-gray-500">
                        <Link to="/dashboard" className="hover:text-primary">
                            Dashboard
                        </Link>{" "}
                        &gt;
                        <span className="text-primary">Customers</span>
                    </div>
                </div>

                {/* Right Side: Export and Add Category Buttons */}
                <div className="flex items-center space-x-2">
                    <button onClick={handleExport}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-primary hover:text-white rounded-lg text-sm font-medium transition-all duration-300">
                        <FiDownload className="w-5 h-5" />
                        <span>Export</span>
                    </button>
                    <Link
                        to={'/dashboard/Customers/new'}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary text-white hover:bg-blue-600 rounded-lg text-sm font-medium transition-all duration-300">
                        <FiPlus className="w-5 h-5" />
                        <span>Add Customer</span>
                    </Link>
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
                            <option value="customer" >Customer</option>
                            <option value="email">Email</option>
                        </select>
                        <div className="relative flex-grow md:flex-grow-0 w-full md:w-auto">
                            <FiSearch className="absolute top-2.5 left-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder={`Search by ${filterType}...`}
                                value={search}
                                onChange={handleSearchChange}
                                className="w-full md:w-72 pl-10 pr-2 py-1 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                        </div>
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
                {/* Customers Table */}
                <div className="bg-white  rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left text-gray-700">
                        <thead className="bg-gray-100">
                            <tr>
                                {[
                                    { key: "userName", label: "Customer" },
                                    { key: "email", label: "Email" },
                                    { key: "birthDate", label: "Birth Date" },
                                    { key: "country", label: "Country" },
                                    { key: "createdAt", label: "Created At" },
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
                                            <span className="text-gray-500">Loading customers...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : sortedCustomers.length <= 0 ? (
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
                                    sortedCustomers.map((customer, index) => (
                                        <tr key={index} className="border-t hover:bg-gray-50">
                                            <td className="px-4 py-3 flex items-center space-x-2">
                                                <img
                                                    src={customer.profilePicture}
                                                    alt={'image'}
                                                    className="w-10 h-10 rounded-lg"
                                                />
                                                <span>{customer.userName}</span>
                                            </td>
                                            <td className="px-4 py-3">{customer.email}</td>
                                            <td className="px-4 py-3">{formatDate(customer.birthDate)}</td>
                                            <td className="px-4 py-3">{customer.country.country}</td>
                                            <td className="px-4 py-3">{formatDate(customer.createdAt)}</td>
                                            <td className="relative space-x-2">
                                                <FiEye onClick={() => nav(`/dashboard/customers/customer/${customer.userID}`)} className="absolute top-[calc(50%-8px)] left-2 text-blue-500 cursor-pointer hover:scale-110 transition-transform" />
                                                <FiEdit2 onClick={() => nav(`/dashboard/customers/${customer.userID}`)} className="absolute top-[calc(50%-8px)] left-6 text-green-500 cursor-pointer hover:scale-110 transition-transform" />
                                                <FiTrash2 onClick={() => handleDelete(customer.userID)} className="absolute top-[calc(50%-8px)] left-12 text-red-500 cursor-pointer hover:scale-110 transition-transform" />
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

export default Customers;