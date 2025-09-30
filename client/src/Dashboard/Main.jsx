import ChartContainer from "../Component/Dashboard/Main/ChartContainer";
import Header from "../Component/Dashboard/Main/Header";
import MetricCard from "../Component/Dashboard/Main/MetricCard";
import QuickActionButton from "../Component/Dashboard/Main/QuickActionButton";
import RecentOrdersTable from "../Component/Dashboard/Main/RecentOrdersTable";
import ProductPerformance from "../Component/Dashboard/Main/ProductPerformance";
import CustomerInsights from "../Component/Dashboard/Main/CustomerInsights";
import InventoryManagement from "../Component/Dashboard/Main/InventoryManagement";
import SalesFunnel from "../Component/Dashboard/Main/SalesFunnel";
import Filters from "../Component/Dashboard/Main/Filters";
import ExportData from "../Component/Dashboard/Main/ExportData";
import UserActivityLogs from "../Component/Dashboard/Main/UserActivityLogs";
import { useState } from "react";

const metrics = [
    { title: "Total Sales", value: "$12,345", icon: "HiShoppingCart", color: "from-blue-500 to-blue-400" },
    { title: "Total Orders", value: "1,234", icon: "HiClipboardList", color: "from-green-500 to-green-400" },
    { title: "Total Customers", value: "567", icon: "HiUsers", color: "from-purple-500 to-purple-400" },
    { title: "Total Revenue", value: "$56,789", icon: "HiCurrencyDollar", color: "from-orange-500 to-orange-400" },
];

const recentOrders = [
    { id: "12345", customer: "John Doe", date: "2023-10-01", status: "Delivered" },
    { id: "12346", customer: "Jane Smith", date: "2023-10-02", status: "Pending" },
    { id: "12347", customer: "Alice Johnson", date: "2023-10-03", status: "Cancelled" },
];

function Main() {
    const [darkMode, setDarkMode] = useState(localStorage.theme === "dark");

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        localStorage.theme = darkMode ? "light" : "dark";
        document.documentElement.classList.toggle("dark", !darkMode);
    };

    const handleFilterChange = (type, value) => {
        console.log(`Filter changed: ${type} = ${value}`);
        // Update charts and tables based on filters
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-6">
            <Header toggleDarkMode={toggleDarkMode} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                {metrics.map((metric, index) => (
                    <MetricCard key={index} {...metric} />
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-2">
                    <ProductPerformance />
                </div>
                <div>
                    <CustomerInsights />
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div>
                    <InventoryManagement />
                </div>
                <div className="lg:col-span-2">
                    <SalesFunnel />
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div>
                    <Filters onFilterChange={handleFilterChange} />
                </div>
                <div>
                    <ExportData />
                </div>
                <div>
                    <UserActivityLogs />
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4 dark:text-white">Quick Actions</h2>
                    <div className="flex gap-4">
                        <QuickActionButton icon="HiPlus" label="Add Product" />
                        <QuickActionButton icon="HiChartBar" label="View Reports" />
                    </div>
                </div>
                <RecentOrdersTable orders={recentOrders} />
            </div>
            <ChartContainer />
        </div>
    );
}

export default Main;