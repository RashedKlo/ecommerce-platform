import React, { useEffect, useState } from "react";
import { FiX, FiSave, FiImage } from "react-icons/fi";
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BASEURL, GETPRODUCT, SELECTEDCATEGORIES, UPDATEPRODUCT } from "../../Api/Api";
import { AXIOS } from "../../Api/MyAxios";
import Placeholder from "../../Component/Placeholder/Placeholder";
function ShowProduct() {
    const [Loading, setLoading] = useState(false);
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
    const nav = useNavigate(null);
    const productID = useParams().id;
    useEffect(() => {

        async function GetProduct() {
            try {
                setLoading(true);

                let res = await AXIOS.get(`${BASEURL}/${GETPRODUCT}/${productID}`);
                setForm(res.data);
                console.log(res.data);
            }
            catch (err) {
                console.log(err);
                // nav("/pagr", { replace: true });
            }
            finally {
                setLoading(false);

            }


        }
        GetProduct();
    }, []);



    console.log([form.imagesDTO]);



    return (
        <>
            <Placeholder loading={Loading} />
            <div className="p-4 bg-white min-h-screen">
                {/* Header */}
                <div className="flex flex-wrap justify-between items-center mb-2">
                    <h1 className="text-2xl font-bold text-gray-800"> {form.productName}</h1>
                </div>

                {/* Breadcrumb */}
                <div className="flex items-center text-sm text-gray-600 mb-6 space-x-2">
                    <Link to="/dashboard" className="hover:text-primary">Dashboard</Link>
                    <span className="text-gray-400"> &gt; </span>
                    <Link to="/dashboard/products" className="hover:text-primary">Products</Link>
                    <span className="text-gray-400"> &gt; </span>
                    <span className="text-primary">{form.productName}</span>
                </div>

                <div className="flex flex-wrap md:flex-nowrap gap-6">
                    {/* General Information Box */}
                    <div className="w-full bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">General Information</h2>
                        {/* Product Name */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-600 mb-2">Product Name</label>
                            <input
                                type="text"
                                name="productName"
                                disabled={true}
                                value={form.productName}
                                placeholder="Type product name here..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
                            <textarea
                                name="description"
                                value={form.description}
                                disabled={true}
                                rows="4"
                                placeholder="Type product description here..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            ></textarea>
                        </div>

                        {/* Price */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-600 mb-2">Price</label>
                            <input
                                type="number"
                                name="price"
                                disabled={true}
                                value={form.price}
                                placeholder="Enter product price"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        {/* Discount */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-600 mb-2">Discount</label>
                            <input
                                type="number"
                                name="discount"
                                value={form.discount}
                                disabled={true}
                                placeholder="Enter product discount"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />

                        </div>

                        {/* Quantity In Stock */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-600 mb-2">Quantity in Stock</label>
                            <input
                                type="number"
                                name="quantityInStock"
                                disabled={true}
                                value={form.quantityInStock}
                                placeholder="Enter quantity in stock"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    {/* Category and Status */}
                    <div className="w-full flex flex-wrap gap-6">
                        {/* Status Box */}
                        <div className="w-full  bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Category</h2>
                            {/* Category and Tags */}
                            <div className="grid grid-cols-1  gap-4">
                                {/* Product Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Product Category</label>
                                    <input
                                        type="number"
                                        name="categoryID"
                                        disabled={true}
                                        value={form.categoryID}
                                        placeholder="Enter CategoryID"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    />

                                </div>
                            </div>
                        </div>
                        <div className="w-full  bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Rating</h2>
                            {/* Rating and Tags */}
                            <div className="grid grid-cols-1  gap-4">
                                {/* Product Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Rating Product</label>
                                    <input
                                        name="rating"
                                        type="number"
                                        value={form.rating}
                                        disabled={true}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    />



                                </div>
                            </div>
                        </div>

                        {/* Image Upload Section */}
                        <div className="w-full bg-white shadow-md rounded-lg p-6">
                            <label className="block text-sm font-medium text-gray-600 mb-2">Product Images</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                {!form.imagesDTO ?
                                    <FiImage className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                                    :
                                    <div className="flex flex-wrap gap-4 mt-4">
                                        {form?.imagesDTO?.map((image, index) => (
                                            <div key={index} className="w-24 h-24 relative">
                                                <img
                                                    src={image["image"]}
                                                    alt="Product"
                                                    className="w-full h-full object-cover rounded-lg"
                                                />

                                            </div>
                                        ))}
                                    </div>
                                }
                            </div>

                        </div>


                    </div>
                </div>
                <div className="flex items-center space-x-4 m-4 justify-end">
                    <button
                        onClick={() => window.history.back()}

                        className="flex items-center px-4 py-2 bg-primary text-white hover:bg-primary-dark rounded-lg text-sm font-medium transition-all duration-300"
                    >
                        <FiX className="w-5 h-5 mr-2" />
                        Cancel
                    </button>

                </div>
            </div>
        </>
    );
}

export default ShowProduct;
