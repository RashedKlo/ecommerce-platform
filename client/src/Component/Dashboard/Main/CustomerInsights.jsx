import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const customerDemographics = [
    { name: "New Customers", value: 400 },
    { name: "Returning Customers", value: 600 },
];

const COLORS = ["#0088FE", "#00C49F"];

function CustomerInsights() {
    return (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Customer Insights</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={customerDemographics}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label
                        >
                            {customerDemographics.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
                <div className="space-y-4">
                    {customerDemographics.map((demo) => (
                        <div key={demo.name} className="flex items-center">
                            <div
                                className="w-4 h-4 rounded-full mr-2"
                                style={{ backgroundColor: COLORS[customerDemographics.indexOf(demo)] }}
                            ></div>
                            <p className="dark:text-white">{demo.name}: {demo.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CustomerInsights;