import React, { useState, useEffect } from "react";
import { HiOutlineShoppingCart, HiOutlineHeart } from "react-icons/hi";
import { AiFillStar } from 'react-icons/ai';
import { FaFacebook, FaTwitter } from 'react-icons/fa';
import RelatedProducts from '../../Component/Web/RelatedProducts';
import Footer from '../../Component/Web/Footer';
import { AXIOS } from '../../Api/MyAxios';
import { useParams } from 'react-router-dom';
import { BASEURL, GETPRODUCT } from '../../Api/Api'

export default function Product() {
    const productID = useParams().id;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bigImage, setBigImage] = useState("");
    const [activeTab, setActiveTab] = useState("info");
    const [form, setForm] = useState({
        categoryID: 0,
        productName: "",
        description: "",
        price: 0,
        discount: 0,
        rating: 0,
        quantityInStock: 0,
        imagesDTO: []
    });
    useEffect(() => {
        async function GetProduct() {
            try {
                setLoading(true);
                let res = await AXIOS.get(`${BASEURL}/${GETPRODUCT}/${productID}`);
                const fetchedProduct = res.data;
                setProduct(fetchedProduct);
                setForm(res.data);
                console.log(form);
            } catch (err) {
                console.error("Error fetching product:", err);
                // Handle error, e.g., redirect to a 404 page
            } finally {
                setLoading(false);
            }
        }
        if (productID) {
            GetProduct();
        }
    }, [productID]);

    if (loading) {
        return <div className="text-center py-20">Loading...</div>;
    }

    if (!product) {
        return <div className="text-center py-20">Product not found.</div>;
    }

    const {
        productName,
        price,
        discount,
        rating,
        description,
        category,
        quantityInStock,
        imagesDTO
    } = product;

    const finalPrice = price * (1 - discount);
    const hasDiscount = discount > 0;
    const isOutOfStock = quantityInStock <= 0;
    const smallImages = imagesDTO.map(img => img.imageUrl);
    console.log(imagesDTO);
    const getStarRating = (productRating) => {
        const fullStars = Math.floor(productRating);
        const hasHalfStar = productRating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <>
                {[...Array(fullStars)].map((_, i) => (
                    <AiFillStar key={`full-${i}`} className="text-yellow-400 text-sm" />
                ))}
                {hasHalfStar && <AiFillStar key="half" className="text-yellow-400 text-sm opacity-50" />}
                {[...Array(emptyStars)].map((_, i) => (
                    <AiFillStar key={`empty-${i}`} className="text-gray-300 text-sm" />
                ))}
            </>
        );
    };

    return (
        <>
            {/* Product Info */}
            <div className="px-4 sm:px-6 lg:px-12 bg-white flex flex-col items-center py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-12">
                    {/* Left Side: Images */}
                    <div className="mt-4">
                        <img
                            src={bigImage || imagesDTO[0]?.image}
                            alt={productName}
                            className="w-full max-w-full h-64 md:h-96 object-contain rounded-lg shadow-lg"
                        />
                        <div className="flex flex-wrap justify-center lg:justify-start gap-2 md:gap-4 mt-6">
                            {imagesDTO?.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.image} // Corrected this line
                                    alt={`${productName} thumbnail ${index + 1}`}
                                    onClick={() => setBigImage(image.image)} // Corrected this line
                                    className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 object-cover cursor-pointer rounded-lg border ${bigImage === image.image
                                        ? "border-blue-500 shadow-lg"
                                        : "border-gray-300 hover:border-blue-400"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Center Section: Details */}
                    <div className="space-y-4">
                        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                            {productName}
                        </h1>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <div className="flex">
                                    {getStarRating(rating)}
                                </div>
                                <p className="text-xs md:text-sm text-gray-500">({rating.toFixed(1)} rating)</p>
                            </div>
                            <a href="#" className="text-primary text-xs md:text-sm underline">
                                Submit a Review
                            </a>
                        </div>
                        <hr className="border-gray-300" />

                        {/* Price and Availability */}
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
                                    ${finalPrice.toFixed(2)}
                                </p>
                                {hasDiscount && (
                                    <>
                                        <p className="text-sm md:text-base text-gray-400 line-through">${price.toFixed(2)}</p>
                                        <span className="text-red-500 text-xs md:text-sm font-bold">
                                            {discount * 100}% OFF
                                        </span>
                                    </>
                                )}
                            </div>
                            <p className="text-sm md:text-base text-gray-600">
                                Availability: <span className={isOutOfStock ? "text-red-500" : "text-green-500"}>
                                    {isOutOfStock ? "Out of Stock" : "In Stock"}
                                </span>
                            </p>
                            <p className="text-sm md:text-base text-gray-600">Category: {category}</p>
                            <p className="text-sm md:text-base text-gray-600">Free Shipping</p>
                        </div>

                        <hr className="border-gray-300" />

                        {/* Select Color (Placeholder since ProductDTO doesn't have it) */}
                        <div className="flex flex-wrap items-center gap-4">
                            <p className="text-sm md:text-base text-gray-600 font-medium">
                                Select Color:
                            </p>
                            {/* Retain static color buttons for now */}
                            <div className="flex space-x-2">
                                {["#006CFF", "#FC3E39", "black", "yellow"].map((color, index) => (
                                    <button
                                        key={index}
                                        className={`w-5 h-5 rounded-full border ${"border-gray-300"
                                            }`}
                                        style={{ backgroundColor: color }}
                                    ></button>
                                ))}
                            </div>
                        </div>

                        {/* Select Size (Placeholder since ProductDTO doesn't have it) */}
                        <div className="flex flex-wrap items-center gap-4">
                            <label htmlFor="size" className="text-sm md:text-base text-gray-600 font-medium">
                                Select Size:
                            </label>
                            <select
                                id="size"
                                className="border border-gray-300 bg-white rounded-md p-2 text-sm md:text-base"
                            >
                                <option>Small</option>
                                <option>Medium</option>
                                <option>Large</option>
                                <option>Extra Large</option>
                            </select>
                        </div>

                        <hr className="border-gray-300" />

                        {/* Quantity and Buttons */}
                        <div className="flex flex-wrap gap-4 items-center">
                            <div className="flex items-center gap-2">
                                <button className="px-3 py-1 bg-blue-100 rounded-md text-primary hover:bg-blue-400 hover:text-white">
                                    -
                                </button>
                                <span className="text-primary">1</span>
                                <button className="px-3 py-1 bg-blue-100 rounded-md text-primary hover:bg-blue-400 hover:text-white">
                                    +
                                </button>
                            </div>
                            <button
                                className={`flex items-center bg-blue-100 text-primary p-2 rounded-lg shadow hover:bg-blue-400 hover:text-white ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isOutOfStock}
                            >
                                <HiOutlineShoppingCart className="mr-2" /> Add To Cart
                            </button>
                            <button className="flex items-center bg-blue-100 text-primary p-2 rounded-lg shadow hover:bg-red-500 hover:text-white">
                                <HiOutlineHeart className="mr-2" /> Wishlist
                            </button>
                        </div>

                        <hr className="border-gray-300" />

                        {/* Share Buttons */}
                        <div className="flex flex-wrap gap-4">
                            <button className="flex items-center gap-1 bg-primary text-white p-2 rounded-lg shadow hover:bg-blue-700">
                                <FaFacebook />
                                <span>Share</span>
                            </button>
                            <button className="flex items-center gap-1 bg-blue-400 text-white p-2 rounded-lg shadow hover:bg-blue-500">
                                <FaTwitter />
                                <span>Tweet</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Description Tabs */}
            <div className="bg-white py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-12">
                    {/* Tabs Header */}
                    <div className="flex justify-center border-b border-gray-300">
                        {["info", "reviews", "faq"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-3 px-6 font-medium text-sm md:text-base transition-all duration-200 ${activeTab === tab
                                    ? "text-primary border-b-4 border-primary"
                                    : "text-gray-500 hover:text-blue-500"
                                    }`}
                            >
                                {tab === "info"
                                    ? "Product Information"
                                    : tab === "reviews"
                                        ? "Reviews"
                                        : "FAQ"}
                            </button>
                        ))}
                    </div>

                    {/* Tabs Content */}
                    <div className="mt-8 bg-white p-8 rounded-lg shadow-lg">
                        {activeTab === "info" && (
                            <div>
                                <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">
                                    Product Details
                                </h3>
                                <p className="mt-4 text-gray-600 text-sm md:text-base leading-relaxed whitespace-pre-line">
                                    {description}
                                </p>
                            </div>
                        )}
                        {activeTab === "reviews" && (
                            <div>
                                <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">
                                    Customer Reviews ({rating.toFixed(1)}/5)
                                </h3>
                                {/* Placeholder for reviews. You would fetch these separately. */}
                                <p className="text-gray-600">No reviews yet. Be the first to review!</p>
                            </div>
                        )}
                        {activeTab === "faq" && (
                            <div>
                                <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">
                                    Frequently Asked Questions
                                </h3>
                                <div className="space-y-4 text-gray-600 text-sm md:text-base">
                                    <details>
                                        <summary className="cursor-pointer font-semibold">What is the return policy?</summary>
                                        <p className="pl-4 mt-2">We offer a 30-day return policy. Items must be in their original condition.</p>
                                    </details>
                                    <details>
                                        <summary className="cursor-pointer font-semibold">Do you ship internationally?</summary>
                                        <p className="pl-4 mt-2">Yes, we offer international shipping. Shipping costs vary based on location.</p>
                                    </details>
                                    <details>
                                        <summary className="cursor-pointer font-semibold">How do I track my order?</summary>
                                        <p className="pl-4 mt-2">You will receive an email with tracking information once your order has been shipped.</p>
                                    </details>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Related Products */}
            <RelatedProducts />

            {/* Footer */}
            <Footer />
        </>
    );
}
