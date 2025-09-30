import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const topProducts = [
    { name: "Product A", sales: 1200, revenue: "$12,000" },
    { name: "Product B", sales: 800, revenue: "$8,000" },
];

function ProductPerformance() {
    return (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Top Selling Products</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topProducts}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="sales" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
                <table className="w-full">
                    <thead>
                        <tr className="text-left border-b dark:border-gray-600">
                            <th className="p-2 dark:text-white">Product</th>
                            <th className="p-2 dark:text-white">Sales</th>
                            <th className="p-2 dark:text-white">Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topProducts.map((product) => (
                            <tr key={product.name} className="border-b dark:border-gray-600">
                                <td className="p-2 dark:text-white">{product.name}</td>
                                <td className="p-2 dark:text-white">{product.sales}</td>
                                <td className="p-2 dark:text-white">{product.revenue}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProductPerformance;