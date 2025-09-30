import { HiDownload } from "react-icons/hi";

function ExportData() {
    const handleExport = (format) => {
        alert(`Exporting data as ${format}`);
    };

    return (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Export Data</h2>
            <div className="flex gap-4">
                <button
                    onClick={() => handleExport("CSV")}
                    className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <HiDownload className="mr-2" />
                    Export as CSV
                </button>
                <button
                    onClick={() => handleExport("PDF")}
                    className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <HiDownload className="mr-2" />
                    Export as PDF
                </button>
            </div>
        </div>
    );
}

export default ExportData;