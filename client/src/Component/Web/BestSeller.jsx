import React, { useState, useEffect } from "react";
import { HiOutlineHeart, HiOutlineShoppingCart } from "react-icons/hi";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { BASEURL, BESTSELLER } from "../../Api/Api";
import { AXIOS } from "../../Api/MyAxios";
import { Navigate, useNavigate } from "react-router-dom";

function BestSeller() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");
    const activePage = 1; // Set default page
    const ItemsPerPage = 8; // Set items per page
    const nav = useNavigate(null);
    // Function to render stars based on rating
    const showStars = (rating) => {
        const fullStars = Math.floor(rating || 0);
        const hasHalfStar = (rating || 0) % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <div className="flex justify-center">
                {[...Array(fullStars)].map((_, i) => (
                    <AiFillStar key={i} className="text-yellow-400 text-lg" />
                ))}
                {hasHalfStar && (
                    <AiFillStar className="text-yellow-400 text-lg opacity-50" />
                )}
                {[...Array(emptyStars)].map((_, i) => (
                    <AiFillStar key={i + fullStars} className="text-lg text-gray-300" />
                ))}
            </div>
        );
    };

    // Function to calculate discounted price
    const calculateDiscountedPrice = (price, discount) => {
        if (!discount || discount === 0) return price;
        return price - (price * discount / 100);
    };

    async function getBestSeller() {
        try {
            setLoading(true);
            let res = await AXIOS.get(`${BASEURL}/${BESTSELLER}?pageNumber=${activePage}&limitOfProducts=${ItemsPerPage}`);
            setProducts(res.data.data || []);
        }
        catch (err) {
            console.log(err);
            setProducts([]); // Set empty array on error
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getBestSeller();
    }, []);

    // Loading placeholder component
    const LoadingCard = () => (
        <div className="relative bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
            {/* Image Placeholder */}
            <div className="relative">
                <div className="bg-gray-300 w-full h-48"></div>
                <div className="absolute top-3 right-3 bg-gray-300 w-16 h-6 rounded-full"></div>
            </div>

            {/* Content Placeholder */}
            <div className="p-4 space-y-4">
                <div className="bg-gray-300 h-6 w-3/4 mx-auto rounded"></div>

                {/* Stars Placeholder */}
                <div className="flex justify-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-gray-300 w-4 h-4 rounded"></div>
                    ))}
                </div>

                {/* Price Placeholder */}
                <div className="flex justify-between items-center">
                    <div className="bg-gray-300 h-4 w-16 rounded"></div>
                    <div className="bg-gray-300 h-6 w-20 rounded"></div>
                </div>

                {/* Buttons Placeholder */}
                <div className="flex justify-between items-center">
                    <div className="flex space-x-3">
                        <div className="bg-gray-300 w-10 h-10 rounded-full"></div>
                        <div className="bg-gray-300 w-10 h-10 rounded-full"></div>
                    </div>
                    <div className="bg-gray-300 h-8 w-24 rounded-md"></div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Best Seller Section */}
            <div className="text-center bg-gray-50 py-10">
                <h3 className="text-3xl font-extrabold text-gray-800 tracking-wide">BEST SELLER</h3>
                <div className="flex justify-center space-x-6 mt-6">
                    {["All", "Bags", "Sneakers", "Belt", "Sunglasses"].map((link, index) => (
                        <a
                            href={`#${link.toLowerCase()}`}
                            key={index}
                            onClick={(e) => {
                                e.preventDefault();
                                setActiveCategory(link);
                            }}
                            className={`font-medium text-lg transition cursor-pointer ${link === activeCategory
                                ? "text-blue-600 underline underline-offset-4"
                                : "text-gray-600 hover:text-blue-600"
                                }`}
                        >
                            {link}
                        </a>
                    ))}
                </div>
            </div>

            {/* Grid of Modern Boxes */}
            <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-8 px-6 md:px-16">
                {loading ? (
                    // Show loading placeholders
                    [...Array(8)].map((_, index) => (
                        <LoadingCard key={index} />
                    ))
                ) : (
                    // Show actual products
                    products.map((product, index) => {
                        const discountedPrice = calculateDiscountedPrice(product?.price, product?.discount);

                        return (
                            <div
                                key={product?.productID || index}
                                onClick={() => nav(`/product/${product?.productID}`)}
                                className="relative bg-white  rounded-lg shadow-lg overflow-hidden transform transition hover:scale-105 hover:shadow-2xl"
                            >
                                {/* Product Image */}
                                <div className="relative">
                                    <img
                                        src={product?.imagesDTO?.[0]?.image || `/assets/product-${(index % 3) + 1}.png`}
                                        alt={product?.productName || "Product"}
                                        className="object-cover w-full h-48"
                                        onError={(e) => {
                                            e.target.src = `/assets/product-${(index % 3) + 1}.png`;
                                        }}
                                    />
                                    {product.discount > 0 && (
                                        <span className="absolute top-3 right-3 bg-red-500 text-white text-sm font-bold py-1 px-3 rounded-full shadow-md">
                                            {product.discount}% OFF
                                        </span>
                                    )}
                                </div>

                                {/* Product Details */}
                                <div className="p-4 space-y-4">
                                    <h1 className="text-center font-semibold">
                                        {product?.productName || "Product Title"}
                                    </h1>

                                    {/* Rating */}
                                    {showStars(product?.rating)}

                                    {/* Price */}
                                    <div className="flex justify-between items-center text-sm">
                                        {product?.discount && product.discount > 0 ? (
                                            <>
                                                <p className="text-gray-400 line-through">${product.price?.toFixed(2)}</p>
                                                <p className="text-primary font-extrabold text-xl">${discountedPrice?.toFixed(2)}</p>
                                            </>
                                        ) : (
                                            <>
                                                <p></p>
                                                <p className="text-primary font-extrabold text-xl">${product?.price?.toFixed(2) || "0.00"}</p>
                                            </>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-between items-center">
                                        <div className="flex space-x-3">
                                            <button className="bg-white p-2 rounded-full shadow-md hover:bg-primary hover:text-white transition">
                                                <HiOutlineShoppingCart size={20} color="#40BFFF" />
                                            </button>
                                            <button className="bg-white p-2 rounded-full shadow-md hover:bg-secondray hover:text-white transition">
                                                <HiOutlineHeart size={20} color="#40BFFF" />
                                            </button>
                                        </div>
                                        <button className="bg-primary text-white text-sm px-4 py-2 rounded-md shadow hover:bg-primary transition">
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Show message if no products */}
            {!loading && products.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No best seller products found.</p>
                </div>
            )}

            {/* View All Products Button */}
            <div className="text-center py-6">
                <button className="bg-primary text-white font-semibold py-3 px-10 rounded-md shadow hover:bg-primary transition text-lg">
                    View All Products
                </button>
            </div>
        </>
    );
}

export default BestSeller;