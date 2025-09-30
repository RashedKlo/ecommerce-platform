import React, { useState, useEffect } from "react";
import { AiFillStar } from "react-icons/ai";
import { BASEURL, LATESTPRODUCT } from "../../Api/Api";
import { AXIOS } from "../../Api/MyAxios";
import { useNavigate } from "react-router-dom";

function LatestProduct() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
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

    async function getLatestProducts() {
        try {
            setLoading(true);
            let res = await AXIOS.get(`${BASEURL}/${LATESTPRODUCT}?pageNumber=${activePage}&limitOfProducts=${ItemsPerPage}`);
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
        getLatestProducts();
    }, []);

    // Show loading state
    if (loading) {
        return (
            <div className="relative bg-gray-50 py-8 overflow-hidden">
                <h3 className="text-2xl font-bold text-center mb-8">Latest Products</h3>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative bg-gray-50 py-8 overflow-hidden">
            {/* Section Header */}
            <h3 className="text-2xl font-bold text-center mb-8">Latest Products</h3>

            {/* Scrolling Product Row */}
            <div className="relative">
                <div className="flex space-x-6 animate-scroll">
                    {products.concat(products).map((product, index) => {
                        const originalIndex = index % products.length;
                        const currentProduct = products[originalIndex];
                        const discountedPrice = calculateDiscountedPrice(currentProduct?.price, currentProduct?.discount);

                        return (
                            <div
                                onClick={() => nav(`/product/${product?.productID}`)}

                                key={`${currentProduct?.productID || index}-${index}`}
                                className="relative min-w-[250px] bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-transform transform hover:scale-105 flex-shrink-0"
                            >

                                {currentProduct.discount > 0 && (
                                    <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-semibold py-1 px-4 rounded-full shadow">
                                        {currentProduct.discount}% OFF
                                    </div>
                                )}

                                {/* Product Image */}
                                <div className="flex justify-center mb-4">
                                    <img
                                        src={currentProduct?.imagesDTO?.[0]?.image || `/assets/product-${(originalIndex % 3) + 1}.png`}
                                        alt={currentProduct?.productName || "Product"}
                                        className="w-36 h-36 object-contain rounded-lg"
                                        onError={(e) => {
                                            e.target.src = `/assets/product-${(originalIndex % 3) + 1}.png`;
                                        }}
                                    />
                                </div>

                                {/* Product Details */}
                                <div className="text-center space-y-3">
                                    <h3 className="font-semibold text-lg text-gray-800 tracking-tight">
                                        {currentProduct?.productName || "Product Title"}
                                    </h3>

                                    {/* Rating */}
                                    {showStars(currentProduct?.rating)}

                                    <div className="text-gray-600">
                                        {currentProduct?.discount && currentProduct.discount > 0 ? (
                                            <>
                                                <p className="text-sm line-through">${currentProduct.price?.toFixed(2)}</p>
                                                <p className="text-primary font-extrabold text-2xl">
                                                    ${discountedPrice?.toFixed(2)}
                                                </p>
                                            </>
                                        ) : (
                                            <p className="text-primary font-extrabold text-2xl">
                                                ${currentProduct?.price?.toFixed(2) || "0.00"}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Background Image */}
            <div
                className="absolute top-0 right-0 h-full w-1/3 bg-cover bg-no-repeat bg-right"
                style={{ backgroundImage: `url('/assets/bg-products.jpg')` }}
            ></div>
        </div>
    );
}

export default LatestProduct;