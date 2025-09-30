import { HiShoppingCart, HiClipboardList, HiUsers, HiCurrencyDollar } from "react-icons/hi";

function MetricCard({ title, value, icon, color }) {
    const IconComponent = {
        HiShoppingCart,
        HiClipboardList,
        HiUsers,
        HiCurrencyDollar,
    }[icon];

    return (
        <div
            className={`p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-gradient-to-r ${color}`}
        >
            <div className="flex items-center">
                <IconComponent className="text-2xl text-white" />
                <div className="ml-4">
                    <p className="text-sm text-white/80">{title}</p>
                    <p className="text-2xl font-bold text-white">{value}</p>
                </div>
            </div>
        </div>
    );
}

export default MetricCard;