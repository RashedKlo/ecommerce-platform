import React, { useEffect, useState } from "react";
import { FiX, FiSave, FiImage } from "react-icons/fi";
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BASEURL, GETPRODUCT, SELECTEDCATEGORIES, UPDATEPRODUCT } from "../../Api/Api";
import { AXIOS } from "../../Api/MyAxios";
import Placeholder from "../../Component/Placeholder/Placeholder";
function EditProduct() {
    const [Loading, setLoading] = useState(false);
    const [Errors, setErrors] = useState({});
    const [Categories, setCategories] = useState([]);
    const [ImagePreview, setImagePreview] = useState([]);
    const [form, setForm] = useState({
        categoryID: 0,
        productName: "",
        description: "",
        price: 0,
        discount: 0,
        rating: 0,
        quantityInStock: 0,
        imagesDTO: [],
        imageFiles: []
    });
    const nav = useNavigate(null);
    const productID = useParams().id;
    const MAX_FILE_SIZE_MB = 5;
    useEffect(() => {
        async function getCategories() {
            try {
                setLoading(true);
                let res = await AXIOS.get(`${BASEURL}/${SELECTEDCATEGORIES}`);
                setCategories(res.data.data);
            }
            catch (err) {
                console.log(err);
                if (err?.response.status == 404) {
                    setCategories([]);
                }
            }

        }
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
        getCategories();
        GetProduct();
    }, []);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };
    let totalSize = 0;

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        let validFiles = [];

        for (const file of files) {
            if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                setErrors((prev) => ({ ...prev, image: "Max File Size 5MB exceeded" }));
                return;
            }
            validFiles.push(file);
        }

        setForm((prevForm) => ({
            ...prevForm,
            imageFiles: validFiles, // Store files temporarily
        }));

        // Preview selected images
        const imageUrls = validFiles.map((file) => URL.createObjectURL(file));
        setImagePreview(imageUrls);
        setErrors((prev) => ({ ...prev, image: '' }));
    };

    const uploadImagesToCloudinary = async () => {
        const uploadedUrls = [];

        for (const file of form.imageFiles) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "imagesstorage");

            try {
                const response = await fetch(`https://api.cloudinary.com/v1_1/dwejn5pxf/image/upload`, {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) throw new Error("Image upload failed");

                const data = await response.json();
                uploadedUrls.push({ Image: data.secure_url });

            } catch (error) {
                console.error("Cloudinary Upload Error:", error);
                return [];
            }
        }

        return uploadedUrls;
    };
    const validate = () => {
        console.log(form.rating);

        const newErrors = {};
        if (!form.productName) newErrors.productName = "Product Name is required.";
        if (!form.categoryID) newErrors.categoryID = "Category is required.";
        if (form.productName.length < 4) newErrors.productName = "Product Name must be at least 4 characters.";
        if (form.productName.length > 50) newErrors.productName = "Product Name must be less than 50 characters.";
        if (form.description.length > 250) newErrors.description = "Description must be less than 250 characters.";
        if (isNaN(form.price) || form.price <= 0) newErrors.price = "Price should be a positive number.";
        if (isNaN(form.discount) || form.discount > 100 || form.discount < 0) newErrors.discount = "Discount should be a positive number between 0 and 100.";
        if (isNaN(form.rating) || form.rating > 5 || form.rating < 0) newErrors.rating = "Rating should be a positive number between 0 and 5.";
        if (isNaN(form.quantityInStock) || form.quantityInStock < 0) newErrors.quantityInStock = "Quantity in stock should be a positive number.";
        return newErrors;
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setLoading(true);

            // Upload images first
            const uploadedImageUrls = await uploadImagesToCloudinary();
            if (uploadedImageUrls.length === 0) {
                setErrors({ image: "Image upload failed. Please try again." });
                return;
            }

            // Prepare JSON payload
            const productData = {
                categoryID: Number(form.categoryID),
                productName: form.productName,
                description: form.description,
                price: parseFloat(form.price),
                discount: parseFloat(form.discount),
                rating: parseFloat(form.rating),
                quantityInStock: parseInt(form.quantityInStock, 10),
                imagesDTO: uploadedImageUrls,  // ✅ Uses correct format
            };

            // Send as JSON (without FormData)
            const res = await AXIOS.post(`${BASEURL}/${ADDPRODUCT}`, productData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log(res);
            nav("/dashboard/products");

        } catch (err) {
            console.error("Adding Product error:", err);
            setErrors({ title: err.response?.data?.message || "An error occurred" });
        } finally {
            setLoading(false);
        }
    };





    return (
        <>
            <Placeholder loading={Loading} />
            <div className="p-4 bg-white min-h-screen">
                {/* Header */}
                <div className="flex flex-wrap justify-between items-center mb-2">
                    <h1 className="text-2xl font-bold text-gray-800">{form.productName}</h1>
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
                                value={form.productName}
                                onChange={handleChange}
                                placeholder="Type product name here..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            {Errors.productName && <p className="text-sm text-red-500">{Errors.productName}</p>}
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Type product description here..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            ></textarea>
                            {Errors.description && <p className="text-sm text-red-500">{Errors.description}</p>}
                        </div>

                        {/* Price */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-600 mb-2">Price</label>
                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                placeholder="Enter product price"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            {Errors.price && <p className="text-sm text-red-500">{Errors.price}</p>}
                        </div>

                        {/* Discount */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-600 mb-2">Discount</label>
                            <input
                                type="number"
                                name="discount"
                                value={form.discount}
                                onChange={handleChange}
                                placeholder="Enter product discount"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            {Errors.discount && <p className="text-sm text-red-500">{Errors.discount}</p>}

                        </div>

                        {/* Quantity In Stock */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-600 mb-2">Quantity in Stock</label>
                            <input
                                type="number"
                                name="quantityInStock"
                                value={form.quantityInStock}
                                onChange={handleChange}
                                placeholder="Enter quantity in stock"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            {Errors.quantityInStock && <p className="text-sm text-red-500">{Errors.quantityInStock}</p>}
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
                                    <select
                                        value={form.categoryID}
                                        onChange={handleChange}
                                        name="categoryID"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value={0} disabled>Select  a Category</option>
                                        {Categories.map((item, index) => (
                                            <option key={index} value={item.categoryID}>{item.title}</option>
                                        ))}
                                    </select>
                                    {Errors.categoryID && <p className="text-sm text-red-500">{Errors.categoryID}</p>}

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
                                        onChange={handleChange}

                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    />


                                    {Errors.rating && <p className="text-sm text-red-500">{Errors.rating}</p>}

                                </div>
                            </div>
                        </div>

                        {/* Image Upload Section */}
                        <div className="w-full bg-white shadow-md rounded-lg p-6">
                            <label className="block text-sm font-medium text-gray-600 mb-2">Product Images</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                {!form.imagesDTO ?
                                    <>
                                        <FiImage className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageUpload}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </>
                                    :
                                    <div className="flex flex-wrap gap-4 mt-4">
                                        {form.imagesDTO.map((image, index) => (
                                            <div key={index} className="w-24 h-24 relative">
                                                <img
                                                    src={image["image"]}
                                                    alt="Product"
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const newForm = { ...form };
                                                        newForm.imagesDTO.splice(index, 1);
                                                        setForm(newForm);
                                                        setImagePreview((prev) => prev.filter((_, i) => i !== index));
                                                    }}
                                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                                >
                                                    <FiX className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                }
                            </div>
                            {Errors.image && <p className="text-sm text-red-500">{Errors.image}</p>}

                        </div>


                    </div>
                </div>
                <div className="flex items-center space-x-4 m-4 justify-end">
                    <button
                        onClick={handleSubmit}
                        className="flex items-center px-4 py-2 bg-primary text-white hover:bg-primary-dark rounded-lg text-sm font-medium transition-all duration-300"
                    >
                        <FiSave className="w-5 h-5 mr-2" />
                        Save
                    </button>
                    <button
                        onClick={() => nav("/dashboard/products")}
                        className="flex items-center px-4 py-2 bg-white text-gray-700 hover:bg-red-100 hover:text-red-600 rounded-lg text-sm font-medium transition-all duration-300">
                        <FiX className="w-5 h-5 mr-2" />
                        Cancel
                    </button>
                </div>
            </div>
        </>
    );
}

export default EditProduct;
