import React from 'react';
import { HiOutlineHeart, HiOutlineShoppingCart } from 'react-icons/hi';
import { Link } from 'react-router-dom';

function BlendedBox(props) {
    return (
        <Link
            to={'/product/12'}
            className="relative bg-gray-100 rounded-lg shadow-md overflow-hidden transform transition hover:scale-105">
            {/* Discount Banner */}
            <div className="absolute top-0 left-0 md:top-4 md:left-4 flex items-center 
            md:gap-2 p-[2px] md:p-1 bg-gray-800 bg-opacity-75 rounded-full text-white text-xs md:text-sm">
                <p className="hidden md:block line-through">${props.price}</p>
                <p className="text-xs md:text-sm font-bold">{props.off}% OFF</p>
            </div>
            {/* Image */} 
            <img
                src={props.src}
                alt={props.title}
                className="object-cover w-[200px] md:w-[380px] h-[80px] md:h-[180px] rounded-t-lg"
            />
            {/* Details */}
            <div className=" text-center space-1  ">
                <h3 className="text-md md:text-lg font-semibold text-gray-800">{props.title}</h3>
                <p className="text-primary font-bold text-sm md:text-xl">${props.price - (props.price * (props.off / 100))}</p>
            </div>
            {/* Hover Actions */}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity duration-300">
                <div className="flex space-x-6 opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-200">
                        <HiOutlineShoppingCart size={20} color="#40BFFF" />
                    </button>
                    <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-200">
                        <HiOutlineHeart size={20} color="#40BFFF" />
                    </button>
                </div>
            </div>
        </Link>
    );
}

export default BlendedBox;
