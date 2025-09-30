import { FiX, FiSave, FiImage, FiEdit } from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import {
  ADDCUSTOMER,
  ALLCOUNTRIES,
  BASEURL,
  GETUSER,
  UPDATECUSTOMER,
} from "../../Api/Api";
import Cookie from "cookie-universal";
import { AXIOS } from "../../Api/MyAxios";
import Placeholder from "../../Component/Placeholder/Placeholder";
import { UploadImageToCloudinary } from "./AddCustomer";

const Customer = () => {
  const [form, setForm] = useState({});
  const cookie = Cookie();
  const formatDate = (dateString) => {
    // Input date string

    // Parse the input date string into a Date object
    const date = new Date(dateString);

    // Extract year, month, and day
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");

    // Format as YYYY-MM-DD
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  };
  const uploadImage = useRef(null);
  const [errors, setErrors] = useState({});
  const [Countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const userID = useParams().id;
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
    async function GetCustomer() {
      try {
        setLoading(true);

        let res = await AXIOS.get(`${BASEURL}/${GETUSER}/${userID}`);
        setForm(res.data);
      } catch (err) {
        console.log(err);
        // nav("/pagr", { replace: true });
      } finally {
        setLoading(false);
      }
    }
    GetCustomer();
    GetCountries();
  }, []);

  console.log(form);

  const validateName = (Name) => Name.length >= 3;

  const validatebirthDate = (birthDate) => {
    const date = new Date(birthDate);

    const year = new Date().getFullYear() - date.getFullYear();
    return year > 4 && year <= 100;
  };

  const validate = () => {
    const newErrors = {};
    if (!form.userName) {
      newErrors.userName = "First name is required";
    } else if (!validateName(form.userName)) {
      newErrors.userName = "First Name must be at least 4 characters long";
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
      setForm({ ...form, profilePicture: null, imagePreview: file });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate form inputs
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      // Upload image to Cloudinary if an image preview exists
      let uploadedImageUrl = form.profilePicture;
      if (form.imagePreview) {
        uploadedImageUrl = await UploadImageToCloudinary(form.imagePreview);

        if (!uploadedImageUrl) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            profilePicture: "Image upload failed. Please try again.",
          }));
          return;
        }
      }

      // Prepare the request body
      const requestBody = {
        userName: form.userName,
        role: form.role,
        countryID: parseInt(form?.country?.countryID),
        birthDate: form.birthDate,
        profilePicture: uploadedImageUrl,
      };

      // Send the PUT request to update the customer
      const response = await AXIOS.put(
        `${BASEURL}/${UPDATECUSTOMER}/${userID}`,
        requestBody
      );

      // Redirect to the customers dashboard after successful update
      nav("/dashboard/customers");
    } catch (error) {
      console.error("Error updating customer:", error);

      // Handle API errors
      if (error.response?.data?.message) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          apiError: error.response.data.message,
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          apiError: "An unexpected error occurred. Please try again later.",
        }));
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
          <div className="bg-white shadow-md rounded-lg p-6 mb-6 lg:mb-0 md:order-1">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Profile Picture
            </h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center relative">
              {/* Display Image Preview or Upload Placeholder */}
              {form.profilePicture || form.imagePreview ? (
                <div className="relative flex justify-center">
                  {/* Image Preview */}
                  <img
                    src={
                      form.profilePicture
                        ? form.profilePicture
                        : URL.createObjectURL(form.imagePreview)
                    }
                    alt="Profile"
                    className="w-full md:w-40 md:h-40 object-cover object-center rounded-lg"
                  />
                  {/* Remove Image Button */}
                  <button
                    onClick={() =>
                      setForm({
                        ...form,
                        profilePicture: null,
                        imagePreview: null,
                      })
                    }
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    aria-label="Remove image"
                  >
                    <FiX className="w-3 md:w-5 h-3 md:h-5" />
                  </button>
                </div>
              ) : (
                /* Upload Placeholder */
                <>
                  <FiImage className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Upload profile picture</p>
                </>
              )}

              {/* Upload Button */}
              <label
                htmlFor="upload-profile-picture"
                className="block bg-primary text-white mt-4 px-4 py-2 rounded-lg cursor-pointer hover:bg-primary-dark transition-colors"
              >
                {form.profilePicture || form.imagePreview
                  ? "Change Image"
                  : "Add Image"}
              </label>
              <input
                id="upload-profile-picture"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>

            {/* Display Error Message */}
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

            {/* Username, Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
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
            </div>

            {/* Country ID and Birth Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Country
                </label>

                <select
                  name="countryID"
                  value={form.countryID || form.country?.countryID}
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
                  value={formatDate(form.birthDate)}
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

export default Customer;
