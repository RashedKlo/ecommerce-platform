// src/components/CategoryCard.jsx

import React from "react";
import { Link } from "react-router-dom";

const CategoryCard = ({ category }) => {
    return (
        <Link to={`/categories/${category.categoryID}`} className="group relative block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div className="relative w-full h-48 sm:h-64 overflow-hidden">
                <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>
            <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary transition-colors duration-300">
                    {category.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1 truncate">{category.description}</p>
            </div>
        </Link>
    );
};

export default CategoryCard;