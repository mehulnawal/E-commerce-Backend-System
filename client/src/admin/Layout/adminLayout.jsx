// src/admin/Layout/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './header';
import Sidebar from './sidebar';

const AdminLayout = () => {
    const [isOpen, setIsOpen] = useState(true);
    const { theme } = useSelector(state => state.themeState);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        // Add overflow-x-hidden here to prevent the whole page from sliding
        <div className={`min-h-screen flex overflow-x-hidden ${theme === 'dark' ? 'bg-[#09090b]' : 'bg-zinc-50'}`}>
            <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

            {/* Use flex-1 and max-w-full to ensure it stays within bounds */}
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isOpen ? 'lg:pl-80' : 'lg:pl-0'}`}>
                <Header isOpen={isOpen} toggleSidebar={toggleSidebar} />

                <main className="flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;