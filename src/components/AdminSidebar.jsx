
import { Link } from 'react-router-dom'
import "../css/adminSlidebar.css"

function AdminSidebar() {
    return (
        <nav className="admin-sidebar">
            <h2 className="logo">Admin</h2>
            <ul>
                <li><Link to="dashboard">Admin Dashboard</Link></li>
                <li><Link to="sarees">Saree's</Link></li>
                <li><Link to="users">Users</Link></li>
                <li><Link to="orders">Orders</Link></li>
                <li><Link to="/">Logout</Link></li>
            </ul>
        </nav>

    )
}

export default AdminSidebar