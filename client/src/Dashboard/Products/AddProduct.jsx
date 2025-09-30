import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ADDPRODUCT, BASEURL, SELECTEDCATEGORIES } from "../../Api/Api";
import Placeholder from "../../Component/Placeholder/Placeholder";
import { FiImage, FiSave, FiX } from "react-icons/fi";
import { AXIOS } from "../../Api/MyAxios";

const AddProduct = () => {
    const [Loading, setLoading] = useState(false);
    const [Errors, setErrors] = useState({});
    const [Categories, setCategories] = useState([]);
    const [ImagePreview, setImagePreview] = useState([]);
    const [form, setForm] = useState({
        categoryID: 0,
        productName: "",
        description: "",
        price: "",
        discount: "",
        rating: "",
        quantityInStock: "",
        images: [], // Changed from imagesDTO to images for file uploads
    });

    const nav = useNavigate();
    const MAX_FILE_SIZE_MB = 5;

    useEffect(() => {
        async function getCategories() {
            try {
                setLoading(true);
                let res = await AXIOS.get(`${BASEURL}/${SELECTEDCATEGORIES}`);
                setCategories(res.data.data);
            } catch (err) {
                console.error(err);
                if (err?.response?.status === 404) {
                    setCategories([]);
                }
            } finally {
                setLoading(false);
            }
        }
        getCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };

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
            images: validFiles, // Store files for form submission
        }));

        // Preview selected images
        const imageUrls = validFiles.map((file) => URL.createObjectURL(file));
        setImagePreview(imageUrls);
        setErrors((prev) => ({ ...prev, image: '' }));
    };

    const validate = () => {
        const newErrors = {};
        if (!form.productName) newErrors.productName = "Product Name is required.";
        if (!form.categoryID) newErrors.categoryID = "Category is required.";
        if (form.productName.length < 4) newErrors.productName = "Product Name must be at least 4 characters.";
        if (form.productName.length > 50) newErrors.productName = "Product Name must be less than 50 characters.";
        if (form.description.length > 250) newErrors.description = "Description must be less than 250 characters.";
        if (!form.price || isNaN(form.price) || form.price <= 0) newErrors.price = "Price should be a positive number.";
        if (!form.discount || isNaN(form.discount) || form.discount > 100 || form.discount < 0) newErrors.discount = "Discount should be between 0 and 100.";
        if (!form.rating || isNaN(form.rating) || form.rating > 5 || form.rating < 0) newErrors.rating = "Rating should be between 0 and 5.";
        if (!form.quantityInStock || isNaN(form.quantityInStock) || form.quantityInStock < 0) newErrors.quantityInStock = "Quantity should be a positive number.";
        if (form.images.length === 0) newErrors.image = "At least one image is required.";
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

            // Create FormData to handle file uploads
            const formData = new FormData();

            // Append form fields
            formData.append("categoryID", Number(form.categoryID));
            formData.append("productName", form.productName);
            formData.append("description", form.description);
            formData.append("price", parseFloat(form.price));
            formData.append("discount", parseFloat(form.discount));
            formData.append("rating", parseFloat(form.rating));
            formData.append("quantityInStock", parseInt(form.quantityInStock, 10));

            // Append images
            form.images.forEach((image, index) => {
                formData.append(`images`, image);
            });

            // Send FormData with files
            const res = await AXIOS.post(`${BASEURL}/${ADDPRODUCT}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            nav("/dashboard/products");

        } catch (err) {
            console.error("Adding Product error:", err);
            setErrors({ title: err.response?.data?.message || "An error occurred" });
        } finally {
            setLoading(false);
        }
    };

    const removeImage = (indexToRemove) => {
        const newImages = form.images.filter((_, index) => index !== indexToRemove);
        const newPreviews = ImagePreview.filter((_, index) => index !== indexToRemove);

        setForm(prevForm => ({
            ...prevForm,
            images: newImages
        }));
        setImagePreview(newPreviews);
    };

    return (
        <>
            <Placeholder loading={Loading} />
            <div className="p-4 bg-white min-h-screen">
                {/* Header */}
                <div className="flex flex-wrap justify-between items-center mb-2">
                    <h1 className="text-2xl font-bold text-gray-800">Add Product</h1>
                </div>

                {/* Breadcrumb */}
                <div className="flex items-center text-sm text-gray-600 mb-6 space-x-2">
                    <Link to="/dashboard" className="hover:text-primary">Dashboard</Link>
                    <span className="text-gray-400"> &gt; </span>
                    <Link to="/dashboard/products" className="hover:text-primary">Products</Link>
                    <span className="text-gray-400"> &gt; </span>
                    <span className="text-primary">Add Product</span>
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
                        <div className="w-full bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Category</h2>
                            {/* Category and Tags */}
                            <div className="grid grid-cols-1 gap-4">
                                {/* Product Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Product Category</label>
                                    <select
                                        value={form.categoryID}
                                        onChange={handleChange}
                                        name="categoryID"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value={0} disabled>Select a Category</option>
                                        {Categories.map((item, index) => (
                                            <option key={index} value={item.categoryID}>{item.title}</option>
                                        ))}
                                    </select>
                                    {Errors.categoryID && <p className="text-sm text-red-500">{Errors.categoryID}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="w-full bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Rating</h2>
                            {/* Rating and Tags */}
                            <div className="grid grid-cols-1 gap-4">
                                {/* Product Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Rating Product</label>
                                    <input
                                        value={form.rating}
                                        onChange={handleChange}
                                        name="rating"
                                        type="number"
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
                                <FiImage className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <div className="flex flex-wrap gap-4 mt-4">
                                    {ImagePreview.map((image, index) => (
                                        <div key={index} className="w-24 h-24 relative">
                                            <img
                                                src={image}
                                                alt="Product"
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                            <button
                                                onClick={() => removeImage(index)}
                                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                            >
                                                <FiX className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
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
                        className="flex items-center px-4 py-2 bg-white text-gray-700 hover:bg-red-100 hover:text-red-600 rounded-lg text-sm font-medium transition-all duration-300"
                    >
                        <FiX className="w-5 h-5 mr-2" />
                        Cancel
                    </button>
                </div>
            </div>
        </>
    );
}

export default AddProduct;