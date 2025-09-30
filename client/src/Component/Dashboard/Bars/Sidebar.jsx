import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AiOutlineAppstore, AiOutlineShopping } from 'react-icons/ai'; // New icons for Dashboard and Products
import { FiUsers, FiChevronDown, FiChevronUp, FiShoppingCart, FiHome } from 'react-icons/fi'; // Updated Orders icon

function Sidebar({ isOpen }) {
    const [isProductsOpen, setIsProductsOpen] = useState(false);

    const toggleProducts = () => setIsProductsOpen(!isProductsOpen);

    return (
        <div
            className={`bg-white text-[#667085] h-full font-medium flex flex-col border-r border-gray-200 transition-transform duration-300 ${isOpen ? 'w-64' : 'w-20'
                }`}
        >
            {/* Logo */}
            <div className="text-xl font-bold p-6 flex justify-center">
                <img
                    src={`/assets/${isOpen ? "Logo.png" : "SmLogo.png"}`}
                    alt="Logo"
                    width={isOpen ? '100px' : '60px'}
                    height="60px"
                    className="hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto">
                <ul className="space-y-3 p-4">

                    {/* Dashboard Link */}
                    <li>
                        <NavLink
                            to="/dashboard/main"
                            className={({ isActive }) =>
                                `flex items-center space-x-2 p-3 rounded-xl ${isActive ? 'bg-primary text-white' : 'hover:bg-gray-100'
                                }`
                            }
                        >
                            <AiOutlineAppstore className="h-5 w-5" />
                            {isOpen && <span>Dashboard</span>}
                        </NavLink>
                    </li>
                    {/* Customers Link */}
                    <li>
                        <NavLink
                            to="/dashboard/home"
                            className={({ isActive }) =>
                                `flex items-center space-x-2 p-3 rounded-xl ${isActive ? 'bg-primary text-white' : 'hover:bg-gray-100'
                                }`
                            }
                        >
                            <FiHome className="h-5 w-5" />
                            {isOpen && <span>Home Screen</span>}
                        </NavLink>
                    </li>
                    {/* Products Dropdown */}
                    <li>
                        <div
                            onClick={toggleProducts}
                            className={`flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 cursor-pointer ${isProductsOpen ? 'text-primary' : 'text-[#667085]'
                                }`}
                        >
                            <div className="flex items-center space-x-2">
                                <AiOutlineShopping className="h-5 w-5" />
                                {isOpen && <span>Products</span>}
                            </div>
                            {isOpen &&
                                (isProductsOpen ? (
                                    <FiChevronUp className="h-4 w-4" />
                                ) : (
                                    <FiChevronDown className="h-4 w-4" />
                                ))}
                        </div>

                        {isOpen && isProductsOpen && (
                            <ul className="mt-1 space-y-2">
                                <li>
                                    <NavLink
                                        to="/dashboard/products"
                                        className={({ isActive }) =>
                                            `flex items-center space-x-2 p-3 rounded-xl ${isActive ? 'bg-primary text-white' : 'hover:bg-gray-100'
                                            }`
                                        }
                                    >
                                        <span className="pl-5">Product List</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/dashboard/categories"
                                        className={({ isActive }) =>
                                            `flex items-center space-x-2 p-3 rounded-xl ${isActive ? 'bg-primary text-white' : 'hover:bg-gray-100'
                                            }`
                                        }
                                    >
                                        <span className="pl-5">Categories</span>
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                    </li>

                    {/* Orders Link */}
                    <li>
                        <NavLink
                            to="/dashboard/orders"
                            className={({ isActive }) =>
                                `flex items-center justify-between p-3 rounded-xl ${isActive ? 'bg-primary text-white' : 'hover:bg-gray-100'
                                }`
                            }
                        >
                            <div className="flex items-center space-x-1">

                                <FiShoppingCart className="h-5 w-5" />

                                {!isOpen && <span className="  bg-secondray rounded-full w-2 h-2 flex items-start justify-start animate-pulse" />}
                                {isOpen && <span>Orders</span>}

                            </div>
                            {isOpen && (
                                <span className="text-xs  text-white bg-secondray rounded-full w-5 h-5 flex items-center justify-center">
                                    5
                                </span>
                            )}
                        </NavLink>
                    </li>

                    {/* Customers Link */}
                    <li>
                        <NavLink
                            to="/dashboard/customers"
                            className={({ isActive }) =>
                                `flex items-center space-x-2 p-3 rounded-xl ${isActive ? 'bg-primary text-white' : 'hover:bg-gray-100'
                                }`
                            }
                        >
                            <FiUsers className="h-5 w-5" />
                            {isOpen && <span>Customers</span>}
                        </NavLink>
                    </li>



                </ul>
            </div>
        </div>
    );
}

export default Sidebar;
