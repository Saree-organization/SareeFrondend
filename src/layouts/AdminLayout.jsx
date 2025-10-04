import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavBar from '../non-outlates/AdminNavBar';
import '../css/adminLayout.css';

export default function AdminLayout() {
    return (
        <div className="admin-layout">
            <AdminNavBar />
            
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}
