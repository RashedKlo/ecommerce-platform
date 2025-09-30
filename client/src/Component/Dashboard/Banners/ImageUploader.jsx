import { FiImage, FiX } from "react-icons/fi";

const ImageUploader = ({ label, id, image, setImage }) => {
  // Determine if `image` is a URL (Cloudinary) or a File object
  const imagePreview =
    image instanceof File ? URL.createObjectURL(image) : image;

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
      <label htmlFor={id} className="cursor-pointer">
        {image ? (
          <div className="relative h-60">
            <img
              src={imagePreview}
              alt={label}
              className="w-full h-60 object-contain object-center rounded-lg"
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                setImage(null);
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <>
            <FiImage className="w-10 h-10 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Click or drag to add {label} image</p>
          </>
        )}
      </label>
      <input
        id={id}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            setImage(file); // Pass file object instead of URL
          }
        }}
      />
    </div>
  );
};

export default ImageUploader;
