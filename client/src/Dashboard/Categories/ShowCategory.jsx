import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BASEURL, GETCATEGORY } from "../../Api/Api";
import { AXIOS } from "../../Api/MyAxios";
import Placeholder from "../../Component/Placeholder/Placeholder";
function ShowCategory() {
    const [Loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        image: "",
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


    return <>
        <Placeholder loading={Loading} />
        <div className="p-4 bg-white min-h-screen">
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
                            disabled={true}

                            placeholder="Type category name here..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />

                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
                        <textarea
                            rows="4"
                            placeholder="Type category description here..."
                            name="description"
                            disabled={true}
                            value={form.description}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        ></textarea>

                    </div>

                </div>
                {/* Thumbnail Section */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Thumbnail</h2>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        {form.image ? (
                            <div className="relative">
                                <img
                                    src={form.image}
                                    alt="Thumbnail"
                                    className="w-full h-40 object-contain rounded-lg"
                                >
                                </img>

                            </div>
                        ) : (
                            <div className="relative">
                                <img
                                    src="/assets/PersonalImage.png"
                                    alt="Thumbnail"
                                    className="w-full h-40 object-contain rounded-lg"
                                >
                                </img>

                            </div>
                        )}


                    </div>
                </div>

            </div>

        </div>
    </>

}

export default ShowCategory;
