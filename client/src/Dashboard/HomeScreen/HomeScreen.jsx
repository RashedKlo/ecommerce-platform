import React, { useState } from "react";
import { FiX, FiSave, FiImage, FiPlus, FiTrash } from "react-icons/fi";
import MainBanner from "../../Component/Dashboard/Banners/Types/MainBanner";



function HomeScreen() {
    const [selectedBanner, setSelectedBanner] = useState("Main"); // State for selected banner
   
   
  

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Home Screen</h1>

            {/* Combobox to select banner type */}
            <div className="mb-6">
                <label className="text-lg font-semibold">Select Banner Type:</label>
                <select
                    value={selectedBanner}
                    onChange={(e) => setSelectedBanner(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
                >
                    <option value="Main">Main Banner</option>
                    <option value="Secondary">Secondary Banner</option>
                    <option value="Sub">SubBanner</option>
                </select>
            </div>

            {/* Main Banner */}
            {selectedBanner === "Main" && <MainBanner bannerName={"main"}/>}

            {/* Secondary Banner */}
            {selectedBanner === "Secondary" && <MainBanner bannerName={"secondary"}/>}

            {/* SubBanner */}
            {selectedBanner === "Sub" &&<MainBanner bannerName={"sub"}/>}

          
       
        </div>
    );
}

export default HomeScreen;