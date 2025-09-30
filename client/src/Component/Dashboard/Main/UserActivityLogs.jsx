const userActivityLogs = [
    { id: 1, user: "Admin", action: "Logged in", timestamp: "2023-10-01 10:00 AM" },
    { id: 2, user: "Manager", action: "Updated product", timestamp: "2023-10-01 09:30 AM" },
];

function UserActivityLogs() {
    return (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 dark:text-white">User Activity Logs</h2>
            <table className="w-full">
                <thead>
                    <tr className="text-left border-b dark:border-gray-600">
                        <th className="p-2 dark:text-white">User</th>
                        <th className="p-2 dark:text-white">Action</th>
                        <th className="p-2 dark:text-white">Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {userActivityLogs.map((log) => (
                        <tr key={log.id} className="border-b dark:border-gray-600">
                            <td className="p-2 dark:text-white">{log.user}</td>
                            <td className="p-2 dark:text-white">{log.action}</td>
                            <td className="p-2 dark:text-white">{log.timestamp}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserActivityLogs;