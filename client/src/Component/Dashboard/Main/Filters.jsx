import { HiCalendar } from "react-icons/hi";

function Filters({ onFilterChange }) {
    return (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Filters</h2>
            <div className="flex gap-4">
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-2">
                    <HiCalendar className="text-gray-500 dark:text-gray-300" />
                    <input
                        type="date"
                        className="ml-2 bg-transparent outline-none dark:text-white"
                        onChange={(e) => onFilterChange("date", e.target.value)}
                    />
                </div>
                <select
                    className="bg-gray-100 dark:bg-gray-700 rounded-lg p-2 outline-none dark:text-white"
                    onChange={(e) => onFilterChange("status", e.target.value)}
                >
                    <option value="">All Statuses</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>
        </div>
    );
}

export default Filters;