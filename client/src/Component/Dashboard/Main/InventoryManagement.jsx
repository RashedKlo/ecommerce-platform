import { HiPlus } from "react-icons/hi";

const lowStockProducts = [
    { id: 1, name: "Product A", stock: 5 },
    { id: 2, name: "Product B", stock: 10 },
];

function InventoryManagement() {
    return (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Low Stock Products</h2>
            <ul className="space-y-2">
                {lowStockProducts.map((product) => (
                    <li key={product.id} className="flex justify-between items-center">
                        <p className="dark:text-white">{product.name}</p>
                        <p className="text-red-500">{product.stock} left</p>
                    </li>
                ))}
            </ul>
            <button className="mt-4 flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                <HiPlus className="mr-2" />
                Restock Now
            </button>
        </div>
    );
}

export default InventoryManagement;