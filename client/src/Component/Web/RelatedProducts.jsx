import React from 'react'
import { AiFillStar } from 'react-icons/ai';

function RelatedProducts() {

    const products = new Array(8).fill(0); // Initial products

    return (
        <div className="relative bg-gray-50 py-8 overflow-hidden">
            {/* Section Header */}
            <h3 className="text-2xl font-bold text-center mb-8">Related Products</h3>


            {/* Scrolling Product Row */}
            <div className="relative">
                <div className="flex space-x-6 animate-scroll">
                    {products.concat(products).map((_, index) => (
                        <div
                            key={index}
                            className="relative min-w-[250px] bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-transform transform hover:scale-105 flex-shrink-0"
                        >
                            {/* Sale Tag */}
                            <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-semibold py-1 px-4 rounded-full shadow">
                                10% OFF
                            </div>

                            {/* Product Image */}
                            <div className="flex justify-center mb-4">
                                <img
                                    src={`/assets/product-${(index % 3) + 1}.png`}
                                    alt="Product"
                                    className="w-36 h-36 object-contain rounded-lg"
                                />
                            </div>

                            {/* Product Details */}
                            <div className="text-center space-y-3">
                                <h3 className="font-semibold text-lg text-gray-800 tracking-tight">
                                    Product Title
                                </h3>
                                {/* Rating */}
                                <div className="flex justify-center">
                                    {[...Array(4)].map((_, i) => (
                                        <AiFillStar key={i} className="text-yellow-400 text-lg" />
                                    ))}
                                    <AiFillStar className="text-lg" color="#737476" />
                                </div>
                                <div className="text-gray-600">
                                    <p className="text-sm line-through">$120.00</p>
                                    <p className="text-primary font-extrabold text-2xl">
                                        $108.00
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
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

export default RelatedProducts