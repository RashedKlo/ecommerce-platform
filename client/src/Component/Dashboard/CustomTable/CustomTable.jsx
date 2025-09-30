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



function CustomTable({ Customers, AllUsers, handleDelete, headers }) {
    const [search, setSearch] = useState("");

    const [sortColumn, setSortColumn] = useState("createdAt");
    const [sortDirection, setSortDirection] = useState("desc");
    const [activePage, setActivePage] = useState(1);
    const [filterType, setFilterType] = useState("customer");
    const [Loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const nav = useNavigate();
    let ItemsPerPage = 10;
    let Pages = Math.ceil(AllUsers / ItemsPerPage);


    const handleSort = (column) => {
        setSortColumn(column);
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    };
    const sortedCustomers = [...Customers].sort((a, b) => {
        const valA = a[sortColumn];
        const valB = b[sortColumn];
        if (valA < valB) return sortDirection === "asc" ? -1 : 1;
        if (valA > valB) return sortDirection === "asc" ? 1 : -1;
        return 0;
    });
    const handleSearchChange = (e) => {
        if (e.target.value !== "")
            setSearch(e.target.value);
    };

    return (

        <div className="shadow-md ">
            {/* Customers Table */}
            <div className="bg-white  rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-100">
                        <tr>
                            {headers.map(({ key, label, sortable = true }) => (
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
                            <th>Action</th>
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
                                        <span className="text-gray-500">Loading ...</span>
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
                                                src={customer.image}
                                                alt={'image'}
                                                className="w-10 h-10 rounded-lg"
                                            />
                                            <span>{customer.customer}</span>
                                        </td>
                                        <td className="px-4 py-3">{customer.email}</td>
                                        <td className="px-4 py-3">{customer.birthDate}</td>
                                        <td className="px-4 py-3">{customer.country}</td>
                                        <td className="px-4 py-3">{customer.createdAt}</td>

                                        <td className="relative space-x-2">
                                            <FiEdit2 onClick={() => nav(`/dashboard/customers/${customer.customerID}`)} className="absolute top-[calc(50%-8px)] left-2 text-green-500 cursor-pointer hover:scale-110 transition-transform" />
                                            <FiTrash2 onClick={handleDelete} className="absolute top-[calc(50%-8px)] left-8 text-red-500 cursor-pointer hover:scale-110 transition-transform" />
                                        </td>
                                    </tr>
                                ))
                            )
                        }
                    </tbody>


                </table>
            </div>

            {/* Footer Section */}



            {
                AllUsers > ItemsPerPage && (
                    <div className="flex flex-wrap justify-between items-center bg-white p-4 border rounded-lg shadow-sm">
                        <div className="text-sm text-gray-500">
                            Showing {(activePage - 1) * ItemsPerPage + 1}-{Math.min(activePage * ItemsPerPage, AllUsers)} of {AllUsers}
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
                )
            }



        </div >

    );
}

export default CustomTable;