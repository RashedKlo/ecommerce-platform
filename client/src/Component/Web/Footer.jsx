import React from "react";
import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-primary to-indigo-600  text-white py-12 px-6 md:px-16">
            {/* Top Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {/* Logo and Description */}
                <div>
                    <img src="/assets/Logo.png" alt="Logo" className="w-32 mb-4" />
                    <p className="text-sm text-gray-200 leading-6">
                        Your one-stop shop for all your favorite shoes and accessories.
                        Discover the latest trends with us!
                    </p>
                </div>

                {/* Follow Us Section */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 uppercase">Follow Us</h3>
                    <p className="text-sm text-gray-200 mb-4">
                        Stay connected on social media.
                    </p>
                    <div className="flex space-x-4">
                        {[
                            { icon: FaFacebookF, link: "#", color: "bg-blue-500" },
                            { icon: FaTwitter, link: "#", color: "bg-sky-400" },
                            { icon: FaInstagram, link: "#", color: "bg-pink-500" },
                            { icon: FaLinkedinIn, link: "#", color: "bg-blue-700" },
                        ].map(({ icon: Icon, link, color }, idx) => (
                            <a
                                key={idx}
                                href={link}
                                className={`p-3 rounded-full ${color} hover:scale-110 transition-transform duration-300 shadow-lg`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Icon size={20} className="text-white" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Contact Us Section */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 uppercase">Contact Us</h3>
                    <p className="text-sm text-gray-200 leading-6">
                        Email: <a href="mailto:support@example.com" className="underline">support@example.com</a> <br />
                        Phone: <a href="tel:+1234567890" className="underline">+123 456 7890</a> <br />
                        Address: 123 Shoe Street, NY, USA
                    </p>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 opacity-30 my-8"></div>

            {/* Information & Services Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-lg font-semibold mb-4 uppercase">Information</h3>
                    <ul className="space-y-2 text-sm text-gray-200">
                        {["About Us", "Privacy Policy", "Terms & Conditions", "FAQs"].map(
                            (item, idx) => (
                                <li
                                    key={idx}
                                    className="hover:text-white transition duration-300 cursor-pointer"
                                >
                                    {item}
                                </li>
                            )
                        )}
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4 uppercase">Services</h3>
                    <ul className="space-y-2 text-sm text-gray-200">
                        {[
                            "Shipping & Returns",
                            "Order Tracking",
                            "Size Guide",
                            "Gift Cards",
                        ].map((item, idx) => (
                            <li
                                key={idx}
                                className="hover:text-white transition duration-300 cursor-pointer"
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="col-span-2">
                    <h3 className="text-lg font-semibold mb-4 uppercase">We Accept</h3>
                    <div className="flex space-x-4">
                        <img
                            src="/assets/brands.png"
                            alt="Payment Methods"
                            className="w-48 object-contain"
                        />
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="mt-12 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-200">
                <p>&copy; 2024 ShoeStore. All rights reserved.</p>
                <div className="flex space-x-6 mt-4 sm:mt-0">
                    <a href="#" className="hover:text-white transition duration-300">
                        Terms of Service
                    </a>
                    <a href="#" className="hover:text-white transition duration-300">
                        Privacy Policy
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
