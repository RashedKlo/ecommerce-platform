import React, { useState, useEffect } from "react";
import { FaTh, FaBars } from "react-icons/fa";
import Footer from "../../Component/Web/Footer";
import Features from "../../Component/Web/Features";
import PagePath from "../../Component/Web/PagePath";
import CategoryCard from "./CategoryCard"; // Assuming you have this component

// Mock data for categories
const mockCategories = [
    {
        categoryID: 1,
        name: "Men's Sneakers",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop&crop=center",
        description: "Stylish and comfortable sneakers for men",
        productCount: 45
    },
    {
        categoryID: 2,
        name: "Women's Handbags",
        image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop&crop=center",
        description: "Premium leather and designer handbags",
        productCount: 32
    },
    {
        categoryID: 3,
        name: "Running Shoes",
        image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=300&h=300&fit=crop&crop=center",
        description: "Professional running shoes for athletes",
        productCount: 28
    },
    {
        categoryID: 4,
        name: "Business Bags",
        image: "https://images.unsplash.com/photo-1590845947670-c009801ffa74?w=300&h=300&fit=crop&crop=center",
        description: "Professional bags for business meetings",
        productCount: 19
    },
    {
        categoryID: 5,
        name: "Casual Shoes",
        image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=300&h=300&fit=crop&crop=center",
        description: "Comfortable shoes for everyday wear",
        productCount: 56
    },
    {
        categoryID: 6,
        name: "Travel Backpacks",
        image: "https://images.unsplash.com/photo-1507764810214-47dfcd3fff57?w=300&h=300&fit=crop&crop=center",
        description: "Durable backpacks for travel and adventure",
        productCount: 23
    },
    {
        categoryID: 7,
        name: "Formal Shoes",
        image: "https://images.unsplash.com/photo-1582897085656-c636d006a246?w=300&h=300&fit=crop&crop=center",
        description: "Elegant formal shoes for special occasions",
        productCount: 34
    },
    {
        categoryID: 8,
        name: "Shoulder Bags",
        image: "https://images.unsplash.com/photo-1591348122503-021e2a1e7088?w=300&h=300&fit=crop&crop=center",
        description: "Stylish shoulder bags for daily use",
        productCount: 41
    },
    {
        categoryID: 9,
        name: "Sports Shoes",
        image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=300&fit=crop&crop=center",
        description: "High-performance shoes for sports activities",
        productCount: 37
    },
    {
        categoryID: 10,
        name: "Laptop Bags",
        image: "https://images.unsplash.com/photo-1586210846236-8ae8dc4a1d10?w=300&h=300&fit=crop&crop=center",
        description: "Protective bags for laptops and electronics",
        productCount: 26
    },
    {
        categoryID: 11,
        name: "Hiking Boots",
        image: "https://images.unsplash.com/photo-1614252369475-531aca22cc80?w=300&h=300&fit=crop&crop=center",
        description: "Durable boots for outdoor adventures",
        productCount: 18
    },
    {
        categoryID: 12,
        name: "Clutch Bags",
        image: "https://images.unsplash.com/photo-1564084055466-dfe0f2e8aed8?w=300&h=300&fit=crop&crop=center",
        description: "Elegant clutch bags for evening events",
        productCount: 15
    },
    {
        categoryID: 13,
        name: "Basketball Shoes",
        image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=300&h=300&fit=crop&crop=center",
        description: "Professional basketball shoes with grip",
        productCount: 22
    },
    {
        categoryID: 14,
        name: "Crossbody Bags",
        image: "https://images.unsplash.com/photo-1607883825846-0ac5d4428e73?w=300&h=300&fit=crop&crop=center",
        description: "Convenient crossbody bags for mobility",
        productCount: 29
    },
    {
        categoryID: 15,
        name: "Canvas Shoes",
        image: "https://images.unsplash.com/photo-1595341888016-a392ef81b2de?w=300&h=300&fit=crop&crop=center",
        description: "Comfortable canvas shoes for casual wear",
        productCount: 33
    },
    {
        categoryID: 16,
        name: "Tote Bags",
        image: "https://images.unsplash.com/photo-1591348122500-3c8b74c91b45?w=300&h=300&fit=crop&crop=center",
        description: "Spacious tote bags for shopping and work",
        productCount: 38
    },
    {
        categoryID: 17,
        name: "Sandals",
        image: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=300&h=300&fit=crop&crop=center",
        description: "Comfortable sandals for summer",
        productCount: 25
    },
    {
        categoryID: 18,
        name: "Wallet Bags",
        image: "https://images.unsplash.com/photo-1507464851265-2d51dd1d63ba?w=300&h=300&fit=crop&crop=center",
        description: "Compact wallet bags for essentials",
        productCount: 31
    }
];

const Categories = () => {
    const [view, setView] = useState("grid");
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const categoriesPerPage = 16;
    const [activePage, setActivePage] = useState(1);
    let ItemsPerPage = 10;

    useEffect(() => {
        // Simulate API call with mock data
        async function getCategories() {
            try {
                setLoading(true);
                
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Simulate pagination logic
                const startIndex = (activePage - 1) * ItemsPerPage;
                const endIndex = startIndex + ItemsPerPage;
                const paginatedData = mockCategories.slice(startIndex, endIndex);
                
                setCategories(mockCategories); // Use all mock data for now
                console.log("Mock categories loaded:", mockCategories);
            }
            catch (err) {
                console.log(err);
                setError("Failed to load categories");
            }
            finally {
                setLoading(false);
            }
        }
        getCategories();
    }, [activePage]);

    const totalPages = Math.ceil(categories.length / categoriesPerPage);
    const currentCategories = categories.slice(
        (currentPage - 1) * categoriesPerPage,
        currentPage * categoriesPerPage
    );

    const changePage = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (loading) {
        return <div className="text-center py-20 text-gray-700">Loading categories...</div>;
    }

    if (error) {
        return <div className="text-center py-20 text-red-500">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Banner Section */}
            <PagePath title="Categories" />

            {/* View Options and Info */}
            <div className="container mx-auto px-4 mt-6">
                <div className="flex flex-wrap justify-between items-center p-6 bg-white shadow-md rounded-md">
                    <div className="flex items-center space-x-4">
                        <FaTh
                            className={`cursor-pointer ${view === "grid" ? "text-primary" : "text-gray-500"}`}
                            onClick={() => setView("grid")}
                        />
                        <FaBars
                            className={`cursor-pointer ${view === "list" ? "text-primary" : "text-gray-500"}`}
                            onClick={() => setView("list")}
                        />
                        <div className="border-l border-gray-300 h-6 mx-4 hidden sm:block"></div>
                        <span className="text-gray-500 animate-slideIn hidden sm:block">
                            {`${(currentPage - 1) * categoriesPerPage + 1}-${Math.min(currentPage * categoriesPerPage, categories.length)} of ${categories.length} results`}
                        </span>
                    </div>
                </div>
            </div>

            {/* Categories Section */}
            <div
                className={`container mx-auto px-4 py-6 grid gap-6 animate-fadeIn ${view === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                    : "grid-cols-1"
                    }`}
            >
                {currentCategories.length > 0 ? (
                    currentCategories.map((category) => (
                        <CategoryCard
                            key={category.categoryID}
                            category={category}
                            view={view} // Pass the view prop
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-500 py-12">
                        No categories found.
                    </div>
                )}
            </div>

            {/* Pagination */}
            {categories.length > categoriesPerPage && (
                <div className="flex justify-center items-center space-x-2 py-6">
                    <button
                        className="p-2 px-4 bg-gray-200 rounded hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => changePage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </button>
                    {[...Array(totalPages).keys()].map((_, index) => (
                        <button
                            key={index}
                            className={`p-2 px-4 rounded transition ${currentPage === index + 1
                                ? "bg-primary text-white"
                                : "bg-gray-200 hover:bg-gray-300"
                                }`}
                            onClick={() => changePage(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        className="p-2 px-4 bg-gray-200 rounded hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => changePage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
            <Features />
            <Footer />
        </div>
    );
};

export default Categories;