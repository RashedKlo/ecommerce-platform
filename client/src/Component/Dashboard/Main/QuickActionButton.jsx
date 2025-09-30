import { HiPlus, HiChartBar } from "react-icons/hi";

function QuickActionButton({ icon, label }) {
    const IconComponent = {
        HiPlus,
        HiChartBar,
    }[icon];

    return (
        <button className="flex items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <IconComponent className="text-xl text-blue-500" />
            <span className="ml-2">{label}</span>
        </button>
    );
}

export default QuickActionButton;