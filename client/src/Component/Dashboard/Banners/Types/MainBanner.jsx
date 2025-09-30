import { useState, useEffect } from "react";
import axios from "axios";
import ImageUploader from "../ImageUploader";
import BlendedShowBox from "../BlendedShowBox";
import { FiSave, FiX } from "react-icons/fi";
import { UploadImageToCloudinary } from "../../../../Dashboard/Customers/AddCustomer";
import { AXIOS } from "../../../../Api/MyAxios";
import { BANNERS, BASEURL, HANDLEBANNERS } from "../../../../Api/Api";
import Placeholder from "../../../Placeholder/Placeholder";
import { Form, useNavigate } from "react-router-dom";

const MainBanner = ({ bannerName }) => {
  const nav = useNavigate(null);
  // State for banner data
  const [bannerData, setBannerData] = useState({
    bannerName: "",
    image: "",
    link: "",
    title: "",
    subtitle: "",
    btnText: "",
    blendedBoxes: [],
  });

  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Fetch banner data from the server on component mount
  useEffect(() => {
    const fetchBannerData = async () => {
      setIsLoading(true);
      try {
        const response = await AXIOS.get(`${BASEURL}/${BANNERS}/${bannerName}`);
        const data = response.data;
        console.log(data);

        setBannerData({
          bannerName: data.bannerName,
          image: data.image,
          link: data.link,
          title: data.title,
          subtitle: data.subtitle,
          btnText: data.btnText,
          blendedBoxes: data.blendedBoxes || [],
        });
      } catch (error) {
        console.error("Error fetching banner data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBannerData();
  }, [bannerName]);
  const updateBlendedBoxes = async () => {
    return Promise.all(
      bannerData.blendedBoxes.map(async (box) => {
        if (box.image instanceof File) {
          const uploadedBoxImage = await UploadImageToCloudinary(box.image);
          return { ...box, image: uploadedBoxImage };
        }
        return box;
      })
    );
  };
  const handleSave = async () => {
    setIsLoading(true);
    try {
      let uploadedImageUrl = bannerData.image;

      // Upload new banner image if it's a file
      if (bannerData.image instanceof File) {
        uploadedImageUrl = await UploadImageToCloudinary(bannerData.image);
        if (!uploadedImageUrl) {
          alert("Banner image upload failed. Please try again.");
          setIsLoading(false);
          return;
        }
      }

      // Upload blended boxes images if they are files

      const updatedBlendedBoxes = await updateBlendedBoxes();

      const updatedBannerData = {
        bannerName: bannerData.bannerName, // ✅ This is fine
        link: bannerData.link,
        image: uploadedImageUrl,
        title: bannerData.title,
        subtitle: bannerData.subtitle,
        btnText: bannerData.btnText,
        blendedBoxes: updatedBlendedBoxes.map((box) => ({
          ...box,
          bannerName: bannerData.bannerName, // ✅ Ensure each box has `bannerName`
        })),
      };

      // Send POST request to update banner
      const res = await AXIOS.post(
        `${BASEURL}/${HANDLEBANNERS}/${bannerName}`,
        updatedBannerData
      );
      console.log(res);
      nav("/dashboard");
    } catch (error) {
      console.error("Error saving banner data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    // Reset form fields to initial fetched data
    setBannerData({
      bannerName: bannerData.bannerName,
      image: bannerData.image,
      link: bannerData.link,
      title: bannerData.title,
      subtitle: bannerData.subtitle,
      btnText: bannerData.btnText,
      blendedBoxes: bannerData.blendedBoxes,
    });
    setFile(null); // Clear the uploaded file
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBannerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleBlendedBoxesChange = (boxes) => {
    console.log(boxes);
    setBannerData((prevData) => ({
      ...prevData,
      blendedBoxes: boxes,
    }));
  };

  return (
    <>
      <Placeholder loading={isLoading} />
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">{bannerName} Banner</h2>
        <div className="gap-4">
          {/* Image Uploader */}
          <ImageUploader
            label="Large Size"
            image={bannerData.image}
            setImage={(image) => setBannerData((prev) => ({ ...prev, image }))}
            id="large-banner"
          />
        </div>

        {/* Input Fields */}
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium">
              Link Destination
            </label>
            <input
              type="text"
              name="link"
              placeholder="Enter link destination"
              value={bannerData.link}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>
        {bannerName === "sub" && (
          <>
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                name="title"
                placeholder="Enter title"
                value={bannerData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Subtitle</label>
              <input
                type="text"
                name="subtitle"
                placeholder="Enter subtitle"
                value={bannerData.subtitle}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Button Text</label>
              <input
                type="text"
                name="btnText"
                placeholder="Enter button text"
                value={bannerData.btnText}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </>
        )}
      </div>
      {bannerName != "sub" && (
        <BlendedShowBox
          bannerName={bannerName}
          data={bannerData?.blendedBoxes} // Pass initial data
          onChange={handleBlendedBoxesChange} // Handle changes
        />
      )}

      {/* Save and Cancel Buttons */}
      <div className="flex justify-end space-x-4 mt-8">
        <button
          onClick={handleCancel}
          className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 border rounded-lg hover:bg-gray-300 transition"
          disabled={isLoading}
        >
          <FiX className="w-5 h-5 mr-2" /> Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          disabled={isLoading}
        >
          <FiSave className="w-5 h-5 mr-2" /> {isLoading ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  );
};

export default MainBanner;
