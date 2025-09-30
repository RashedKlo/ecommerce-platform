import { FunnelChart, Funnel, Tooltip, LabelList, ResponsiveContainer } from "recharts";

const salesFunnelData = [
    { name: "Leads", value: 1000 },
    { name: "Prospects", value: 600 },
    { name: "Conversions", value: 300 },
];

function SalesFunnel() {
    return (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Sales Funnel</h2>
            <ResponsiveContainer width="100%" height={300}>
                <FunnelChart>
                    <Funnel dataKey="value" data={salesFunnelData}>
                        <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
                    </Funnel>
                    <Tooltip />
                </FunnelChart>
            </ResponsiveContainer>
        </div>
    );
}

export default SalesFunnel;