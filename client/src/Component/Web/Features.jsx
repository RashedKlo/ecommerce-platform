import { FaShippingFast } from "react-icons/fa";
import {
    HiOutlineRefresh,
    HiOutlineSupport,
    HiOutlineShieldCheck,
} from "react-icons/hi";

function Features() {
    return (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 py-12 mt-0 px-6 md:px-12">
            {/* Section Header */}
            <h3 className="text-3xl font-bold text-center mt-0 text-gray-800 mb-10 tracking-wide">
                Why Shop With Us
            </h3>

            {/* Feature Cards */}
            <div className=" mt-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    {
                        icon: FaShippingFast,
                        title: "Fast Delivery",
                        description: "Get your orders delivered quickly and on time.",
                        color: "text-blue-500",
                    },
                    {
                        icon: HiOutlineRefresh,
                        title: "Easy Returns",
                        description: "Hassle-free returns within 30 days.",
                        color: "text-green-500",
                    },
                    {
                        icon: HiOutlineShieldCheck,
                        title: "Secure Payments",
                        description:
                            "Your transactions are safe with our advanced security.",
                        color: "text-purple-500",
                    },
                    {
                        icon: HiOutlineSupport,
                        title: "24/7 Support",
                        description: "Our team is here to assist you anytime.",
                        color: "text-yellow-500",
                    },
                ].map((feature, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center text-center bg-white rounded-xl shadow-md p-6 transform transition-all hover:scale-105 hover:shadow-lg"
                    >
                        <feature.icon
                            size={56}
                            className={`${feature.color} mb-4 transition-transform duration-300`}
                        />
                        <h4 className="font-semibold text-lg text-gray-800 mb-2">
                            {feature.title}
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Features;
