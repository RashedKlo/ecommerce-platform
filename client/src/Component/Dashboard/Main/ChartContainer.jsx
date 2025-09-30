import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from "recharts";

const salesData = [
    { date: "2023-10-01", sales: 4000 },
    { date: "2023-10-02", sales: 3000 },
    { date: "2023-10-03", sales: 2000 },
    { date: "2023-10-04", sales: 2780 },
    { date: "2023-10-05", sales: 1890 },
    { date: "2023-10-06", sales: 2390 },
    { date: "2023-10-07", sales: 3490 },
];

const revenueData = [
    { month: "Jan", revenue: 5000 },
    { month: "Feb", revenue: 6000 },
    { month: "Mar", revenue: 7000 },
    { month: "Apr", revenue: 8000 },
    { month: "May", revenue: 9000 },
    { month: "Jun", revenue: 10000 },
];

function ChartContainer() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Sales Trends</h2>
                <LineChart width={500} height={300} data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                 </LineChart>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Revenue Growth</h2>
                <BarChart width={500} height={300} data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis /> 
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
            </div>
        </div>
    );
}

export default ChartContainer;