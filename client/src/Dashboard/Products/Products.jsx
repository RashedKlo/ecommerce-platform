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
    FiStar
} from "react-icons/fi";
import { AXIOS } from "../../Api/MyAxios";
import { ALLPRODUCTS, BASEURL, DELETEPRODUCT, EXPORTPRODUCTS, FILTERPRODUCTS } from "../../Api/Api";
function Products() {

    const [sortColumn, setSortColumn] = useState("createdAt");
    const [sortDirection, setSortDirection] = useState("desc");
    const [activePage, setActivePage] = useState(1);
    const [filterType, setFilterType] = useState("productname");
    const [Loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [Products, setProducts] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [total, setTotal] = useState(0);
    const nav = useNavigate();
    const showStars = (amount) => {
        const stars = Math.round(amount);

        const ShowGoldStars = Array.from({ length: stars }).map((item, index) => (
            <FiStar key={index} color="gold" />
        ));
        const ShowGrayStars = Array.from({ length: 5 - stars }).map((item, index) => (
            <FiStar key={index} color="gray" />
        ));
        return <div className="flex">{ShowGoldStars}{ShowGrayStars}</div>
    }
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

            getProducts();
    }, [search, activePage]);

    async function getProducts() {
        try {
            setLoading(true);
            let res = await AXIOS.get(`${BASEURL}/${ALLPRODUCTS}?pageNumber=${activePage}&limitOfProducts=${ItemsPerPage}`);
            setTotal(res.data.total);
            setProducts(res.data.data);
        }
        catch (err) {
            console.log(err);


        }
        finally {
            setLoading(false);
        }
    }


    //Modify it
    async function getSearchResults() {
        if (search.trim().length == 0)
            return;
        try {
            setLoading(true);
            let res = await AXIOS.get(`${BASEURL}/${FILTERPRODUCTS}=${filterType}&value=${search}&pageNumber=${activePage}&LimitOfProducts=${ItemsPerPage}`);
            setTotal(res.data.total);
            setProducts(res.data.data);
            console.log(res.data.data);
        }
        catch (err) {
            console.log(err?.response);
            if (err?.response.status == 404) {
                setProducts([]);
            }
        }
        finally {
            setLoading(false);
        }
    }






    const handleExport = async () => {
        try {
            const response = await AXIOS.get(`${BASEURL}/${EXPORTPRODUCTS}?pageNumber=${activePage}&limitOfProducts=${ItemsPerPage}`, {
                responseType: "blob",
            });

            if (!response || !response.data) {
                throw new Error("No data received from the server.");
            }

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "products.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        catch (error) {
            console.error("Error exporting products:", error.response?.data || error.message);
            alert("Failed to export products. Please try again.");
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
    const sortedProducts = [...Products].sort((a, b) => {
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
            let res = await AXIOS.delete(`${BASEURL}/${DELETEPRODUCT}/${ID}`);
            setProducts(Products.filter((product) => product.userID != ID));
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
                    <h1 className="text-lg font-semibold text-gray-800">Products</h1>
                    <div className="text-sm text-gray-500">
                        <Link to="/dashboard" className="hover:text-primary">
                            Dashboard
                        </Link>{" "}
                        &gt;
                        <span className="text-primary">Products</span>
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
                        to={'/dashboard/Products/new'}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary text-white hover:bg-blue-600 rounded-lg text-sm font-medium transition-all duration-300">
                        <FiPlus className="w-5 h-5" />
                        <span>Add Product</span>
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
                            <option value="productname" >Product Name</option>
                            <option value="category">Category</option>
                            <option value="price">Price</option>
                            <option value="rating">Rating</option>
                        </select>
                        <div className="relative flex-grow md:flex-grow-0 w-full md:w-auto">
                            <FiSearch className="absolute top-2.5 left-3 text-gray-400" />

                            <input
                                type={["price", "rating"].includes(filterType) ? "number" : "text"}
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
                {/* Products Table */}
                <div className="bg-white  rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left text-gray-700">
                        <thead className="bg-gray-100">
                            <tr>
                                {[
                                    { key: "productName", label: "Product" },
                                    { key: "description", label: "Description" },
                                    { key: "category", label: "Category" },
                                    { key: "quantityInStock", label: "Stock" },
                                    { key: "rating", label: "Rating" },
                                    { key: "price", label: "Price" },
                                    { key: "discount", label: "Discount" },
                                    { key: "createdDate", label: "Created At" },
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
                                            <span className="text-gray-500">Loading Products...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : sortedProducts.length <= 0 ? (
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
                                    sortedProducts.map((product, index) => (
                                        <tr key={index} className="border-t hover:bg-gray-50">
                                            <td className="px-4 py-3 flex items-center space-x-2">
                                                <img
                                                    src={product?.imagesDTO[0]?.image}
                                                    alt={'image'}
                                                    className="w-10 h-10 rounded-lg"
                                                />
                                                <span>{product.productName}</span>
                                            </td>
                                            <td className="px-4 py-3">{product.description}</td>
                                            <td className="px-4 py-3">{formatDate(product.category)}</td>
                                            <td className="px-4 py-3">{product.quantityInStock}</td>
                                            <td className="px-4 py-3">
                                                {showStars(product.rating)}

                                            </td>
                                            <td className="px-4 py-3">{product.price}</td>
                                            <td className="px-4 py-3">{product.discount}</td>
                                            <td className="px-4 py-3">{formatDate(product.createdAt)}</td>
                                            <td className="relative space-x-2">
                                                <FiEye onClick={() => nav(`/dashboard/products/product/${product.productID}`)} className="absolute top-[calc(50%-8px)] left-2 text-blue-500 cursor-pointer hover:scale-110 transition-transform" />
                                                <FiEdit2 onClick={() => nav(`/dashboard/products/${product.productID}`)} className="absolute top-[calc(50%-8px)] left-6 text-green-500 cursor-pointer hover:scale-110 transition-transform" />
                                                <FiTrash2 onClick={() => handleDelete(product.productID)} className="absolute top-[calc(50%-8px)] left-12 text-red-500 cursor-pointer hover:scale-110 transition-transform" />
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

export default Products;