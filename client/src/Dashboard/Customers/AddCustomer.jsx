import { FiX, FiSave, FiImage, FiEdit } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { ADDCUSTOMER, ALLCOUNTRIES, BASEURL } from "../../Api/Api";
import Cookie from "cookie-universal";
import { AXIOS } from "../../Api/MyAxios";
import Placeholder from "../../Component/Placeholder/Placeholder";
export async function UploadImageToCloudinary(file) {
  const uploadedUrls = [];
  console.log(file);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "imagesstorage");

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dwejn5pxf/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) throw new Error("Image upload failed");

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return "";
  }
}
const AddCustomer = () => {
  const [form, setForm] = useState({
    userName: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
    countryID: 0,
    profilePicture: "",
  });
  const cookie = Cookie();
  const uploadImage = useRef(null);
  const [errors, setErrors] = useState({});
  const [Countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const MAX_FILE_SIZE_MB = 1;
  useEffect(() => {
    async function GetCountries() {
      try {
        let res = await AXIOS.get(`${BASEURL}/${ALLCOUNTRIES}`);
        setCountries(res.data);
      } catch (err) {
        console.error("Error loading countries:", err);
      }
    }
    GetCountries();
  }, []);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());

  const validateName = (Name) => Name.length >= 3;

  const validatebirthDate = (birthDate) => {
    const date = new Date(birthDate);
    const year = new Date().getFullYear() - date.getFullYear();
    return year > 4 && year <= 100;
  };

  const validatePassword = (password) => {
    const hasFourLetters = (password.match(/[a-zA-Z]/g) || []).length >= 3;
    const hasFourNumbers = (password.match(/\d/g) || []).length >= 3;
    return hasFourLetters && hasFourNumbers;
  };

  const validateConfirmPassword = (password, confirmPassword) =>
    password === confirmPassword;

  const validate = () => {
    const newErrors = {};
    if (!form.userName) {
      newErrors.userName = "First name is required";
    } else if (!validateName(form.userName)) {
      newErrors.userName = "First Name must be at least 4 characters long";
    }

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(form.password)) {
      newErrors.password = "Password must be strong";
    } else if (!validateConfirmPassword(form.password, form.confirmPassword)) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!form.birthDate) {
      newErrors.birthDate = "BirthDate is required";
    } else if (!validatebirthDate(form.birthDate)) {
      newErrors.birthDate =
        "BirthDate must be more than 8 years and less than 100 years";
    }
    if (form.role === "") {
      newErrors.role = "Role is required";
    }
    if (form.countryID === 0) {
      newErrors.countryID = "Country is required";
    }
    if (form.profilePicture === "") {
      newErrors.profilePicture = "Profile Picture is required";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const isValidSize = file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;
    if (!isValidSize) {
      setErrors({ ...errors, profilePicture: "exceeds 1MB and was not added" });
      return;
    }
    if (file) {
      setErrors({ ...errors, profilePicture: "" });
      setForm({ ...form, profilePicture: file });
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

      const uploadedImageUrl = await UploadImageToCloudinary(
        form.profilePicture
      );
      if (!uploadedImageUrl) {
        setErrors({
          ...errors,
          profilePicture: "Image upload failed. Please try again.",
        });
        return;
      }
      let res = await AXIOS.post(`${BASEURL}/${ADDCUSTOMER}`, {
        userName: form.userName,
        email: form.email,
        role: form.role,
        password: form.password,
        confirmPassword: form.confirmPassword,
        birthDate: form.birthDate,
        countryID: parseInt(form.countryID),
        profilePicture: uploadedImageUrl,
      });
      nav("/dashboard/customers");
    } catch (err) {
      console.error("Adding Customer error:", err);
      if (err.response?.message) {
        setErrors({ email: err.response.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Placeholder loading={loading} />
      <div className="p-4  min-h-screen bg-white">
        {/* Header */}
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-600 mb-6 space-x-2">
          <Link to="/dashboard" className="hover:text-primary">
            Dashboard
          </Link>
          <span className="text-gray-400"> &gt; </span>
          <Link to="/dashboard/customers" className="hover:text-primary">
            Customers
          </Link>
          <span className="text-gray-400"> &gt; </span>
          <span className="text-primary">Add Customer</span>
        </div>

        {/* Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Picture Section */}
          <div className="bg-white shadow-md md:order-1 rounded-lg p-6 mb-6 lg:mb-0">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Profile Picture
            </h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 md:p-4 text-center relative">
              {form.profilePicture ? (
                <div className="relative flex justify-center">
                  {/* Image Preview */}
                  <img
                    src={URL.createObjectURL(form.profilePicture)}
                    alt="Profile"
                    className="w-full md:w-40 md:h-40 object-cover object-center rounded-lg"
                  />

                  <button
                    onClick={() => setForm({ ...form, profilePicture: "" })}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <FiX className=" w-3 md:w-5 h-3 md:h-5" />
                  </button>
                </div>
              ) : (
                <>
                  <FiImage className="w-5 md:w-10 h-5 md:h-10 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Upload profile picture</p>
                </>
              )}
              <label
                htmlFor="upload-profile-picture"
                className="block bg-primary text-white mt-4 px-2 md:px-4 py-1 md:py-2 rounded-lg cursor-pointer hover:bg-primary-dark"
              >
                Add Image
              </label>
              <input
                id="upload-profile-picture"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            {errors.profilePicture && (
              <p className="text-red-500 text-sm mt-4 text-center">
                {errors.profilePicture}
              </p>
            )}
          </div>
          {/* General Information Section */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              General Information
            </h2>

            {/* Username, Role, and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="userName"
                  value={form.userName}
                  onChange={handleChange}
                  placeholder="Enter username"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.userName && (
                  <p className="text-red-500 text-xs mt-1">{errors.userName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Role
                </label>

                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full"
                >
                  <option value={""} disabled>
                    None
                  </option>
                  <option value={"User"}>User</option>
                  <option value={"Admin"}>Admin</option>
                </select>
                {errors.role && (
                  <p className="text-red-500 text-sm">{errors.role}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Country ID and Birth Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Country
                </label>

                <select
                  name="countryID"
                  value={form.countryID}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full"
                >
                  <option value={0} disabled>
                    None
                  </option>
                  {Countries.map((item, index) => (
                    <option key={index} value={item.countryID}>
                      {item.country}
                    </option>
                  ))}
                </select>
                {errors.countryID && (
                  <p className="text-red-500 text-sm">{errors.countryID}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Birth Date
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={form.birthDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.birthDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.birthDate}
                  </p>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Confirm Password
              </label>
              <input
                type="Password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Enter confirmPassword"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center lg:justify-end space-x-4 mt-12">
          <button
            type="submit"
            onClick={handleSubmit}
            className="flex items-center px-4 py-2 bg-primary text-white hover:bg-primary-dark rounded-lg text-sm font-medium transition-all duration-300"
          >
            <FiSave className="w-5 h-5 mr-2" />
            Save
          </button>
          <Link
            to="/dashboard/customers"
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 border hover:bg-red-100 hover:text-red-600 rounded-lg text-sm font-medium transition-all duration-300"
          >
            <FiX className="w-5 h-5 mr-2" />
            Cancel
          </Link>
        </div>
      </div>
    </>
  );
};

export default AddCustomer;
