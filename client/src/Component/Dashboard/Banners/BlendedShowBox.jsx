import { useEffect, useState } from "react";
import { FiPlus, FiTrash } from "react-icons/fi";
import ImageUploader from "./ImageUploader";

const BlendedShowBox = ({ bannerName, data = [], onChange }) => {
  if (data.length == 0) {
    return;
  }
  const [showBoxes, setShowBoxes] = useState(data.length > 0);
  const [boxes, setBoxes] = useState(
    data.length > 0
      ? data
      : [
          {
            id: 0, // Unique ID
            title: "",
            image: "",
            price: 0,
            discount: 0,
            bannerName: bannerName,
          },
        ]
  );
  // Handle changes in box fields (image, price, discount)
  const handleBoxChange = (index, field, value) => {
    console.log(`Updating box ${index} - ${field}:`, value);

    const updatedBoxes = boxes.map((box, i) =>
      i === index ? { ...box, [field]: value } : box
    );

    setBoxes(updatedBoxes);
    if (onChange) onChange(updatedBoxes);
  };

  // Add a new box (up to 3 boxes)
  const addBox = () => {
    if (boxes.length < 3) {
      const newBox = {
        id: 0, // Unique ID for each box
        title: "",
        image: "",
        price: 0,
        discount: 0,
        bannerName: bannerName,
      };
      setBoxes([...boxes, newBox]);
    }
  };

  // Remove a box by index
  const removeBox = (index) => {
    const updatedBoxes = boxes.filter((_, i) => i !== index);
    setBoxes(updatedBoxes);
    if (onChange) onChange(updatedBoxes);
  };

  return (
    <>
      <div className="mb-6">
        <label className="text-lg font-semibold">Show boxes on banner?</label>
        <div className="flex space-x-4 mt-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="showBoxes"
              checked={showBoxes}
              onChange={() => setShowBoxes(true)}
            />
            <span>Yes</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="showBoxes"
              checked={!showBoxes}
              onChange={() => setShowBoxes(false)}
            />
            <span>No</span>
          </label>
        </div>
      </div>

      {showBoxes && (
        <div className="space-y-6">
          {boxes.map((box, index) => (
            <div key={index} className="p-8 border rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Box {index + 1}</h3>

              {/* Image Uploader for Desktop Image */}
              <ImageUploader
                label="Desktop Image"
                image={box.image}
                setImage={(url) => handleBoxChange(index, "image", url)}
                id={`desktop-image-${index}`} // Use index for unique ID
              />

              {/* Price Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium">Price</label>
                <input
                  type="number"
                  placeholder="Enter price"
                  value={box.price}
                  onChange={(e) =>
                    handleBoxChange(index, "price", Number(e.target.value))
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
                />
              </div>

              {/* Title Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium">Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter title"
                  value={box.title}
                  onChange={(e) =>
                    handleBoxChange(index, "title", e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
                />
              </div>

              {/* Discount Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium">Discount</label>
                <input
                  type="number"
                  placeholder="Enter discount"
                  value={box.discount}
                  onChange={(e) =>
                    handleBoxChange(index, "discount", Number(e.target.value))
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
                />
              </div>

              {/* Remove Box Button */}
              <button
                onClick={() => removeBox(index)}
                className="text-red-500 flex items-center space-x-2 hover:text-red-600"
              >
                <FiTrash /> <span>Remove</span>
              </button>
            </div>
          ))}

          {/* Add Another Box Button (if less than 3 boxes) */}
          {boxes.length < 3 && (
            <button
              onClick={addBox}
              className="text-blue-500 flex items-center space-x-2 hover:text-blue-600"
            >
              <FiPlus /> <span>Add another box</span>
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default BlendedShowBox;
