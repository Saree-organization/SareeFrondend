import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from "../components/AdminSidebar"
import '../css/adminLayout.css';

export default function AdminLayout() {
    return (
        <div className="admin-layout">
            <AdminSidebar />
            
            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
}
