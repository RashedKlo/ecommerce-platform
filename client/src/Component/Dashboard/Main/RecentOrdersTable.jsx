function RecentOrdersTable({ orders }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
            <table className="w-full">
                <thead>
                    <tr className="text-left border-b">
                        <th className="p-2">Order ID</th>
                        <th className="p-2">Customer</th>
                        <th className="p-2">Date</th>
                        <th className="p-2">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} className="border-b">
                            <td className="p-2">{order.id}</td>
                            <td className="p-2">{order.customer}</td>
                            <td className="p-2">{order.date}</td>
                            <td className="p-2">
                                <span
                                    className={`px-2 py-1 rounded-full text-sm ${
                                        order.status === "Delivered"
                                            ? "bg-green-100 text-green-700"
                                            : order.status === "Pending"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                 >
                                    {order.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default RecentOrdersTable;