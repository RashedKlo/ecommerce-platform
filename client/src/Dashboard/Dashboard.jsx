import { useState } from 'react';
import Sidebar from '../Component/Dashboard/Bars/Sidebar';
import Topbar from '../Component/Dashboard/Bars/Topbar';
import { Outlet } from 'react-router-dom';


function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="flex min-h-screen bg-white">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Topbar */}
                <Topbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

                <Outlet />
            </div>
        </div>
    );
}

export default DashboardLayout;
