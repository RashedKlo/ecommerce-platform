import { Link, useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from 'react';
import { BASEURL, GETUSER } from '../../Api/Api';
import { AXIOS } from "../../Api/MyAxios";
import Placeholder from "../../Component/Placeholder/Placeholder";
import { FiX } from "react-icons/fi";

const ShowCustomer = () => {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        userName: '',
        role: '',
        birthDate: '',
        countryID: 0,
        profilePicture: '',
    });

    const userID = useParams().id;

    useEffect(() => {

        async function GetCustomer() {
            try {
                setLoading(true);
                let res = await AXIOS.get(`${BASEURL}/${GETUSER}/${userID}`);
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
        GetCustomer();
    }, []);



    return <>
        <Placeholder loading={loading} />
        <div className="p-4 bg-white min-h-screen ">
            {/* Header */}
            {/* Left Side: Breadcrumbs */}
            <div className="mb-4">
                <h1 className="text-lg font-semibold text-gray-800">Customers</h1>
                <div className="text-sm text-gray-500">
                    <Link to="/dashboard" className="hover:text-primary">
                        Dashboard
                    </Link>{" "}
                    &gt;

                    <Link to="/dashboard/customers" className="hover:text-primary">
                        Customers
                    </Link>{" "}
                    &gt;
                    <span className="text-primary"> {form.userName}</span>
                </div>
            </div>

            {/* Form Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Profile Picture Section */}
                <div className="bg-white shadow-md md:order-1 rounded-lg  p-6 mb-6 lg:mb-0">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile Picture</h2>
                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center relative">
                       {/* Display Image Preview or Upload Placeholder */}
                       {form.profilePicture  &&(
                           <div className="relative flex justify-center">
                               {/* Image Preview */}
                               <img
                                   src={form.profilePicture ? form.profilePicture : URL.createObjectURL(form.imagePreview)}
                                   alt="Profile"
                                   className="w-full md:w-40 md:h-40 object-cover object-center rounded-lg"
                               />
                             
                           </div>
                       )}
               
                 
                   </div>

                </div>
                {/* General Information Section */}
                <div className="bg-white shadow-md   rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">General Information</h2>

                    {/* Username, Role */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Username</label>
                            <input
                                type="text"
                                name="userName"
                                value={form.userName}
                                disabled={true}
                                placeholder="Enter username"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Role</label>

                            <input
                                type="text"
                                name="userName"
                                value={form.role}
                                disabled={true}
                                placeholder="Enter username"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />

                        </div>

                    </div>

                    {/* Country ID and Birth Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Country</label>

                            <input
                                type="text"
                                value={form?.country?.country}
                                disabled={true}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Birth Date</label>
                            <input
                                type="text"
                                name="birthDate"
                                disabled={true}
                                value={new Date(form.birthDate).toLocaleDateString()}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
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
};

export default ShowCustomer;
