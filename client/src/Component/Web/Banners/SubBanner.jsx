import React from "react";
import PropTypes from "prop-types"; // For prop validation
import { Link } from "react-router-dom";

function SubBanner({  img, to, title, subtitle, ctaText }) {
    // Early return if no image is provided
    if (!img) {
        return null;
    }

    return (
        <div className="relative w-full overflow-hidden">
            {/* SubBanner Image with Overlay */}
            <div className="relative h-[300px] md:h-[500px]">
               <img
    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=300&fit=crop"
    alt="SubBanner"
    className="w-full h-full object-cover"
/>
                {/* Overlay Text */}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center p-4">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        {title}
                    </h1>
                    <p className="text-lg md:text-xl text-white mb-6">{subtitle}</p>
                    <Link
                        to={to}
                        className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                    >
                        {ctaText}
                    </Link>
                </div>
            </div>

       
        </div>
    );
}

// Prop Validation
SubBanner.propTypes = {
    showBoxes: PropTypes.bool, // Whether to show the BlendedBoxes
    img: PropTypes.string.isRequired, // Image path for the SubBanner
    to: PropTypes.string.isRequired, // Link destination
    boxesData: PropTypes.arrayOf(
         PropTypes.shape({
            title: PropTypes.string.isRequired,
            src: PropTypes.string.isRequired,
            price: PropTypes.string.isRequired,
            off: PropTypes.string.isRequired,
        })
    ), // Data for BlendedBoxes
    title: PropTypes.string, // SubBanner title
    subtitle: PropTypes.string, // SubBanner subtitle
    ctaText: PropTypes.string, // Call-to-action button text
};

// Default Props
SubBanner.defaultProps = {
    showBoxes: false, // Default to not showing BlendedBoxes
    boxesData: [], // Default empty array for boxesData
    title: "Welcome to Our Store",
    subtitle: "Discover the latest trends and exclusive offers.",
    ctaText: "Shop Now",
};

export default SubBanner;