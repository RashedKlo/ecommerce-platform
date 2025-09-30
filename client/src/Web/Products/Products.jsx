import React, { useState } from "react";
import { FaFilter, FaTh, FaBars } from "react-icons/fa";
import { AiFillStar } from "react-icons/ai";
import { HiOutlineShoppingCart, HiOutlineHeart } from "react-icons/hi";
import Footer from "../../Component/Web/Footer";
import Features from "../../Component/Web/Features";
import PagePath from "../../Component/Web/PagePath";

// Mock data for products
const mockProducts = [
    {
        id: 1,
        title: "Nike Air Max 270",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
        originalPrice: 120.00,
        salePrice: 108.00,
        discount: 10,
        rating: 4,
        category: "sneakers"
    },
    {
        id: 2,
        title: "Leather Handbag",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
        originalPrice: 85.00,
        salePrice: 76.50,
        discount: 10,
        rating: 5,
        category: "bags"
    },
    {
        id: 3,
        title: "Running Shoes Pro",
        image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&h=300&fit=crop",
        originalPrice: 95.00,
        salePrice: 85.50,
        discount: 10,
        rating: 4,
        category: "shoes"
    },
    {
        id: 4,
        title: "Business Laptop Bag",
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&h=300&fit=crop",
        originalPrice: 110.00,
        salePrice: 99.00,
        discount: 10,
        rating: 4,
        category: "bags"
    },
    {
        id: 5,
        title: "Casual Canvas Shoes",
        image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=300&h=300&fit=crop",
        originalPrice: 65.00,
        salePrice: 58.50,
        discount: 10,
        rating: 4,
        category: "shoes"
    },
    {
        id: 6,
        title: "Travel Backpack",
        image: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=300&h=300&fit=crop",
        originalPrice: 75.00,
        salePrice: 67.50,
        discount: 10,
        rating: 5,
        category: "bags"
    },
    {
        id: 7,
        title: "Formal Oxford Shoes",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
        originalPrice: 140.00,
        salePrice: 126.00,
        discount: 10,
        rating: 4,
        category: "shoes"
    },
    {
        id: 8,
        title: "Designer Shoulder Bag",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=300&fit=crop",
        originalPrice: 90.00,
        salePrice: 81.00,
        discount: 10,
        rating: 4,
        category: "bags"
    },
    {
        id: 9,
        title: "Basketball Sneakers",
        image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=300&h=300&fit=crop",
        originalPrice: 130.00,
        salePrice: 117.00,
        discount: 10,
        rating: 5,
        category: "sneakers"
    },
    {
        id: 10,
        title: "Crossbody Bag",
        image: "https://images.unsplash.com/photo-1591348122500-3c8b74c91b45?w=300&h=300&fit=crop",
        originalPrice: 55.00,
        salePrice: 49.50,
        discount: 10,
        rating: 4,
        category: "bags"
    },
    {
        id: 11,
        title: "Hiking Boots",
        image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300&h=300&fit=crop",
        originalPrice: 115.00,
        salePrice: 103.50,
        discount: 10,
        rating: 5,
        category: "shoes"
    },
    {
        id: 12,
        title: "Evening Clutch",
        image: "https://images.unsplash.com/photo-1524498427077-d6c90a1ea42d?w=300&h=300&fit=crop",
        originalPrice: 45.00,
        salePrice: 40.50,
        discount: 10,
        rating: 4,
        category: "bags"
    },
    {
        id: 13,
        title: "White Sneakers",
        image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=300&h=300&fit=crop",
        originalPrice: 80.00,
        salePrice: 72.00,
        discount: 10,
        rating: 4,
        category: "sneakers"
    },
    {
        id: 14,
        title: "Tote Bag Large",
        image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop",
        originalPrice: 70.00,
        salePrice: 63.00,
        discount: 10,
        rating: 4,
        category: "bags"
    },
    {
        id: 15,
        title: "Summer Sandals",
        image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=300&h=300&fit=crop",
        originalPrice: 50.00,
        salePrice: 45.00,
        discount: 10,
        rating: 4,
        category: "shoes"
    },
    {
        id: 16,
        title: "Wallet Purse",
        image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=300&h=300&fit=crop",
        originalPrice: 35.00,
        salePrice: 31.50,
        discount: 10,
        rating: 4,
        category: "bags"
    },
    {
        id: 17,
        title: "Sport Sneakers",
        image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=300&h=300&fit=crop",
        originalPrice: 105.00,
        salePrice: 94.50,
        discount: 10,
        rating: 5,
        category: "sneakers"
    },
    {
        id: 18,
        title: "Leather Messenger Bag",
        image: "https://images.unsplash.com/photo-1553775282-20af4d3086db?w=300&h=300&fit=crop",
        originalPrice: 125.00,
        salePrice: 112.50,
        discount: 10,
        rating: 5,
        category: "bags"
    },
    {
        id: 19,
        title: "Casual Loafers",
        image: "https://images.unsplash.com/photo-1582897085656-c636d006a246?w=300&h=300&fit=crop",
        originalPrice: 85.00,
        salePrice: 76.50,
        discount: 10,
        rating: 4,
        category: "shoes"
    },
    {
        id: 20,
        title: "Mini Backpack",
        image: "https://images.unsplash.com/photo-1507464851265-2d51dd1d63ba?w=300&h=300&fit=crop",
        originalPrice: 60.00,
        salePrice: 54.00,
        discount: 10,
        rating: 4,
        category: "bags"
    },
    {
        id: 21,
        title: "High-Top Sneakers",
        image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=300&h=300&fit=crop",
        originalPrice: 90.00,
        salePrice: 81.00,
        discount: 10,
        rating: 4,
        category: "sneakers"
    },
    {
        id: 22,
        title: "Work Briefcase",
        image: "https://images.unsplash.com/photo-1590845947670-c009801ffa74?w=300&h=300&fit=crop",
        originalPrice: 150.00,
        salePrice: 135.00,
        discount: 10,
        rating: 5,
        category: "bags"
    },
    {
        id: 23,
        title: "Trail Running Shoes",
        image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=300&fit=crop",
        originalPrice: 100.00,
        salePrice: 90.00,
        discount: 10,
        rating: 4,
        category: "shoes"
    },
    {
        id: 24,
        title: "Vintage Satchel",
        image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop",
        originalPrice: 95.00,
        salePrice: 85.50,
        discount: 10,
        rating: 4,
        category: "bags"
    },
    {
        id: 25,
        title: "Retro Sneakers",
        image: "https://images.unsplash.com/photo-1595341888016-a392ef81b2de?w=300&h=300&fit=crop",
        originalPrice: 75.00,
        salePrice: 67.50,
        discount: 10,
        rating: 4,
        category: "sneakers"
    },
    {
        id: 26,
        title: "Gym Duffel Bag",
        image: "https://images.unsplash.com/photo-1607883825846-0ac5d4428e73?w=300&h=300&fit=crop",
        originalPrice: 65.00,
        salePrice: 58.50,
        discount: 10,
        rating: 4,
        category: "bags"
    },
    {
        id: 27,
        title: "Dress Shoes",
        image: "https://images.unsplash.com/photo-1614252369475-531aca22cc80?w=300&h=300&fit=crop",
        originalPrice: 120.00,
        salePrice: 108.00,
        discount: 10,
        rating: 5,
        category: "shoes"
    },
    {
        id: 28,
        title: "Chain Shoulder Bag",
        image: "https://images.unsplash.com/photo-1591348122503-021e2a1e7088?w=300&h=300&fit=crop",
        originalPrice: 80.00,
        salePrice: 72.00,
        discount: 10,
        rating: 4,
        category: "bags"
    },
    {
        id: 29,
        title: "Slip-On Sneakers",
        image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=300&h=300&fit=crop",
        originalPrice: 55.00,
        salePrice: 49.50,
        discount: 10,
        rating: 4,
        category: "sneakers"
    },
    {
        id: 30,
        title: "Laptop Sleeve Bag",
        image: "https://images.unsplash.com/photo-1586210846236-8ae8dc4a1d10?w=300&h=300&fit=crop",
        originalPrice: 40.00,
        salePrice: 36.00,
        discount: 10,
        rating: 4,
        category: "bags"
    },
    {
        id: 31,
        title: "Waterproof Boots",
        image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=300&h=300&fit=crop",
        originalPrice: 110.00,
        salePrice: 99.00,
        discount: 10,
        rating: 5,
        category: "shoes"
    },
    {
        id: 32,
        title: "Designer Clutch",
        image: "https://images.unsplash.com/photo-1564084055466-dfe0f2e8aed8?w=300&h=300&fit=crop",
        originalPrice: 70.00,
        salePrice: 63.00,
        discount: 10,
        rating: 4,
        category: "bags"
    }
];

const ProductsPage = () => {
    const [view, setView] = useState("grid");
    const [products, setProducts] = useState(mockProducts);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 16;

    const totalPages = Math.ceil(products.length / productsPerPage);
    const currentProducts = products.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );

    const handleSort = (sortOption) => {
        let sortedProducts = [...products];
        
        if (sortOption === "all") {
            sortedProducts = mockProducts;
        } else {
            sortedProducts = mockProducts.filter(product => product.category === sortOption);
        }
        
        setProducts(sortedProducts);
        setCurrentPage(1); // Reset to first page when filtering
    };

    const changePage = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <AiFillStar 
                key={i} 
                className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
            />
        ));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Banner Section */}
            <PagePath title={"Shop"} />

            {/* Filter and View Options */}
            <div className="container mx-auto px-4 mt-6">
                <div className="flex flex-wrap justify-between items-center p-6 bg-white shadow-md rounded-md">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <FaFilter className="mr-2 text-gray-500" />
                            <span className="text-gray-700 font-semibold">Filter</span>
                        </div>
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
                            {`${(currentPage - 1) * productsPerPage + 1}-${Math.min(currentPage * productsPerPage, products.length)} of ${products.length} results`}
                        </span>
                    </div>

                    <div className="flex items-center space-x-4 mt-4 md:mt-0">
                        <span className="text-gray-700">Sort By</span>
                        <select
                            className="border border-gray-300 rounded p-2 transition hover:border-primary"
                            onChange={(e) => handleSort(e.target.value)}
                        >
                            <option value="all">All Products</option>
                            <option value="bags">Bags</option>
                            <option value="shoes">Shoes</option>
                            <option value="sneakers">Sneakers</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Products Section */}
            <div className="container mx-auto px-4">
                <div
                    className={`grid gap-6 py-6 animate-fadeIn ${view === "grid"
                        ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                        : "grid-cols-1"
                        }`}
                >
                    {currentProducts.map((product) => (
                        <div
                            key={product.id}
                            className={`relative bg-white rounded-lg shadow-lg overflow-hidden transform transition hover:scale-105 hover:shadow-2xl ${view === "list" ? "flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4" : ""
                                }`}
                        >
                            {/* Product Image */}
                            <div className={`relative ${view === "list" ? "sm:w-1/3 w-full" : "w-full"}`}>
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="object-cover w-full h-48 hover:opacity-90 transition"
                                />
                                <span className="absolute top-3 right-3 bg-red-500 text-white text-sm font-bold py-1 px-3 rounded-full shadow-md animate-bounce">
                                    {product.discount}% OFF
                                </span>
                            </div>

                            {/* Product Details */}
                            <div className={`p-4 space-y-4 ${view === "list" ? "sm:w-2/3" : ""}`}>
                                <h1 className="text-center sm:text-left font-semibold text-gray-800">
                                    {product.title}
                                </h1>
                                
                                {/* Rating */}
                                <div className="flex justify-center sm:justify-start">
                                    {renderStars(product.rating)}
                                </div>

                                {/* Price */}
                                <div className="flex justify-between items-center text-sm">
                                    <p className="text-gray-400 line-through">${product.originalPrice.toFixed(2)}</p>
                                    <p className="text-primary font-extrabold text-xl">${product.salePrice.toFixed(2)}</p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-3">
                                        <button className="bg-white p-2 rounded-full shadow-md hover:bg-primary hover:text-white transition">
                                            <HiOutlineShoppingCart size={20} />
                                        </button>
                                        <button className="bg-white p-2 rounded-full shadow-md hover:bg-red-500 hover:text-white transition">
                                            <HiOutlineHeart size={20} />
                                        </button>
                                    </div>
                                    <button className="bg-primary text-white text-sm px-4 py-2 rounded-md shadow hover:bg-blue-600 transition">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination */}
            {products.length > productsPerPage && (
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

export default ProductsPage;