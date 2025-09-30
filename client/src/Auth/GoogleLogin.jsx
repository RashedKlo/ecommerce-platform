import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ALLCOUNTRIES, BASEURL, UPDATECUSTOMER } from '../Api/Api';
import Cookie from 'cookie-universal';
import Placeholder from '../Component/Placeholder/Placeholder';
import { AiOutlineCamera as CameraIcon } from 'react-icons/ai';
import { AXIOS } from '../Api/MyAxios';
export default function GoogleLogin() {
    const [formData, setFormData] = useState({
        userName: '',
        lastName: '',
        firstName: '',
        birthDate: '',
        countryID: 0,
        image: null,
        role: 'User',
    });
    const UserID = useParams().id;
    const cookie = Cookie();
    const uploadImage = useRef(null);
    const [errors, setErrors] = useState({});
    const [Countries, setCountries] = useState([]);
    const nav = useNavigate();
    const [loading, setLoading] = useState(false);
    const MAX_FILE_SIZE_MB = 1;
    useEffect(() => {
        async function GetCountries() {
            try {
                let res = await axios.get(`${BASEURL}/${ALLCOUNTRIES}`);
                setCountries(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        GetCountries();
    }, []);

    const validateName = (Name) => Name.length >= 3;

    const validatebirthDate = (birthDate) => {
        const date = new Date(birthDate);
        const year = new Date().getFullYear() - date.getFullYear();
        return year > 4 && year <= 100;
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.firstName) {
            newErrors.firstName = 'First name is required';
        } else if (!validateName(formData.firstName)) {
            newErrors.firstName = 'First Name must be at least 4 characters long';
        }
        if (!formData.lastName) {
            newErrors.lastName = 'Last name is required';
        } else if (!validateName(formData.lastName)) {
            newErrors.lastName = 'Last Name must be at least 4 characters long';
        }
        if (!formData.birthDate) {
            newErrors.birthDate = 'Birth date is required';
        } else if (!validatebirthDate(formData.birthDate)) {
            newErrors.birthDate = 'Birth date must be more than 8 years and less than 100 years';
        }
        if (formData.countryID === 0) {
            newErrors.countryID = 'Country is required';
        }
        formData.userName = formData.firstName + ' ' + formData.lastName;
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const isValidSize = file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;
        if (!isValidSize) {
            setErrors({ ...errors, image: 'exceeds 1MB and was not added' });
            return;
        }
        if (file) {
            setErrors({ ...errors, image: '' });
            setFormData({ ...formData, image: URL.createObjectURL(file) });
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
            let res = await AXIOS.put(`${BASEURL}/${UPDATECUSTOMER}/${UserID}`, formData);
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 30);
            cookie.set("currentUser", res.data.user, { path: '/', expires: expirationDate });
            localStorage.removeItem("recentSearches");
            nav("/");
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className=" container mx-auto mt-8  p-8 rounded-lg ">
            <Placeholder loading={loading} />
            <form onSubmit={handleSubmit} className="bg-white shadow-md p-6 rounded-md max-w-xl mx-auto">
                <h5 className={`text-2xl font-bold mb-1 text-primary`}>Please fill info</h5>
                <h4 className={`text-3xl font-bold mb-4 text-primary`}>E-Com</h4>
                <div className="flex flex-col items-center mb-4">
                    <div className="relative w-24 h-24">
                        <img
                            onClick={() => uploadImage.current.click()}
                            src={formData.image || '/assets/PersonalImage.png'}  // Note the leading slash
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover cursor-pointer"
                        />

                        <div
                            onClick={() => uploadImage.current.click()}
                            className="absolute bottom-0 right-0 bg-gray-300 p-1 rounded-full shadow-lg hover:bg-gray-400 cursor-pointer"
                        >
                            <CameraIcon size={20} className="text-gray-700" />
                        </div>
                    </div>
                </div>

                {errors.image && (
                    <p className="text-red-500 text-sm text-center">{errors.image}</p>
                )}

                <div className="flex flex-col justify-between  sm:flex-row gap-2 ">
                    <div className='md:w-1/2 sm:w-full'>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="First Name"
                            className="border p-2 rounded-md  w-full"
                        />
                        {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                    </div>
                    <div className='md:w-1/2 w-full'>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Last Name"
                            className="border p-2 rounded-md w-full"
                        />
                        {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                    </div>

                </div>

                <div className="flex flex-col sm:flex-row gap-2 mt-4">

                    <div className='md:w-1/2 sm:w-full'>
                        <input
                            type="date"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleChange}
                            className="border p-2 rounded-md w-full"
                        />
                        {errors.birthDate && <p className="text-red-500 text-sm">{errors.birthDate}</p>}
                    </div>
                </div>

                <div className="mt-4">
                    <select
                        name="countryID"
                        value={formData.countryID}
                        onChange={handleChange}
                        className="border p-2 rounded-md w-full"
                    >
                        <option value={0} disabled>Country</option>
                        {Countries.map((item, index) => (
                            <option key={index} value={item.countryID}>{item.country}</option>
                        ))}
                    </select>
                    {errors.countryID && <p className="text-red-500 text-sm">{errors.countryID}</p>}
                </div>



                <input type="file" name='image' ref={uploadImage} hidden onChange={handleImageChange} />

                <button
                    type="submit"
                    className="w-full py-2 mt-4 rounded-md bg-primary text-white"

                >
                    Next
                </button>
            </form>
        </div>
    );
}
