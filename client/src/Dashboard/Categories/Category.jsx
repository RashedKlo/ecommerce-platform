import React, { useEffect, useState } from "react";
import { FiX, FiSave, FiImage } from "react-icons/fi";
import { Link, useNavigate, useParams } from 'react-router-dom'
import { UPDATECATEGORY, BASEURL, GETCATEGORY, ADDCATEGORY } from "../../Api/Api";
import { AXIOS } from "../../Api/MyAxios";
import Placeholder from "../../Component/Placeholder/Placeholder";
async function UploadImagesToCloudinary(file) {

    console.log((file));


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
        return (data.secure_url);


    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        return "";
    }


};
function Category() {
    const [Loading, setLoading] = useState(false);
    const [Errors, setErrors] = useState({});
    const [form, setForm] = useState({
        image: null,
        imagePreview: null,
        description: "",
        title: "",
    })
    const categoryID = useParams().id;

    useEffect(() => {
        async function GetCategory() {
            try {
                setLoading(true);

                let res = await AXIOS.get(`${BASEURL}/${GETCATEGORY}/${categoryID}`);
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
        GetCategory();
    }, [])
    const nav = useNavigate(null);
    const MAX_FILE_SIZE_MB = 1;

    const validate = () => {
        const newErrors = {};
        if (!form.title) {
            newErrors.title = 'Title is required';
        }
        else if (form.title <= 3) {
            newErrors.title = 'Title must be at least 4 characters long';
        }
        else if (form.title > 50) {
            newErrors.title = 'Title must be at less than 50 characters long';
        }
        if (form.description && form.description.length > 250) {
            newErrors.description = 'Title must be less than 250 characters long';
        }

        return newErrors;
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const isValidSize = file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;
        if (!isValidSize) {
            setErrors({ ...Errors, image: 'exceeds 1MB and was not added' });
            return;
        }
        if (file) {
            setErrors({ ...Errors, image: '' });
            setForm({ ...form, image: null,imagePreview:file });
        }
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
            let uploadedImageUrls=form.image;
               if(form.imagePreview)
               {
                 uploadedImageUrls = await UploadImagesToCloudinary(form.imagePreview);
                        if (!uploadedImageUrls) {
                            setErrors({ ...Errors, image: 'Image upload failed. Please try again.' });
                            return;
                        }
               }
            let res = await AXIOS.put(`${BASEURL}/${UPDATECATEGORY}/${categoryID}`, {
                image: uploadedImageUrls,
                description: form.description,
                title: form.title,
            });
            nav("/dashboard/categories");
        } catch (err) {
            console.error('Adding Category error:', err);
            if (err.response?.message) {
                setErrors({ title: err.response.message });
            }
        } finally {
            setLoading(false);
        }
    };
    return <>
        <Placeholder loading={Loading} />
        <div className="p-4 bg-white-100 min-h-screen">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center mb-2">
                <h1 className="text-2xl font-bold text-gray-800">{form.title}</h1>
            </div>

            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-gray-600 mb-6 space-x-2">
                <Link to="/dashboard" className="hover:text-primary">Dashboard</Link>
                <span className="text-gray-400"> &gt; </span>
                <Link to="/dashboard/categories" className="hover:text-primary">Categories</Link>
                <span className="text-gray-400"> &gt; </span>
                <span className="text-primary">{form.title}</span>
            </div>

            {/* Form Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* General Information Section */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">General Information</h2>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-600 mb-2">Category Name</label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Type category name here..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        {Errors.title && <p className="text-red-500 text-sm">{Errors.title}</p>}

                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
                        <textarea
                            rows="4"
                            placeholder="Type category description here..."
                            name="description"
                            onChange={handleChange}
                            value={form.description}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        ></textarea>
                        {Errors.description && <p className="text-red-500 text-sm">{Errors.description}</p>}

                    </div>

                </div>
                {/* Thumbnail Section */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Thumbnail</h2>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        {form.image || form.imagePreview ? (
                            <div className="relative">
                                <img
                                    src={form.image?form.image : URL.createObjectURL(form.imagePreview)}
                                    alt="Thumbnail"
                                    className="w-full h-40 object-contain rounded-lg"
                                >
                                </img>
                                <button
                                    onClick={() => setForm({ ...form, image: null,imagePreview:null })}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                                >
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <FiImage className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">Drag and drop image here, or click add image</p>
                            </>
                        )}
                        <label
                            htmlFor="upload-thumbnail"
                            className="block bg-primary text-white mt-4 px-4 py-2 rounded-lg cursor-pointer hover:bg-primary-dark"
                        >
                            Add Image
                        </label>
                        <input
                            id="upload-thumbnail"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                        />
                    </div>
                      {Errors.image && (
                    <p className="text-red-500 text-sm mt-4 text-center">{Errors.image}</p>
                )}
                </div>
              
            </div>
            {/* buttons */}
            <div className="flex items-center justify-center lg:justify-end  space-x-4 mt-12">
                <button className="flex items-center px-4 py-2 bg-primary text-white hover:bg-primary-dark rounded-lg text-sm font-medium transition-all duration-300"
                    onClick={handleSubmit}>
                    <FiSave className="w-5 h-5 mr-2" />
                    Save
                </button>
                <Link to="/dashboard/categories" className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 border hover:bg-red-100 hover:text-red-600 rounded-lg text-sm font-medium transition-all duration-300">
                    <FiX className="w-5 h-5 mr-2" />
                    Cancel
                </Link>

            </div>
        </div>
    </>

}

export default Category;
