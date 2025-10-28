import React, { useEffect, useState } from "react";
import API from "../../api/API";
import "../../css/adminDashboard.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);

  // filter form state
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // colors for pie chart
  const COLORS = ["#ffb347", "#82ca9d"];

  // fetch orders (with optional filters)
  const fetchOrders = (status, date) => {
    let url = `/api/payment/admin-all-orders?`;
    if (status) url += `status=${status}&`;
    if (date) url += `date=${date}&`;

    API.get(url)
      .then((res) => {
        console.log(res.data.orders);
        setOrders(res.data.orders);
      })
      .catch((err) => console.error("Error fetching orders:", err));
  };

  // load all orders initially
  useEffect(() => {
    fetchOrders();
  }, []);

  // apply filters when button clicked
  const handleFilterClick = () => {
    fetchOrders(filterStatus, filterDate);
  };

  // summary counts
  const totalOrders = orders.length;
 const totalRevenue = orders
  .reduce((sum, o) => sum + (o.totalAmount || 0), 0)
  .toFixed(2);

  const shippingOrders = orders.filter(
    (o) => o.orderStatus?.toUpperCase() === "SHIPPING"
  ).length;
  const deliveredOrders = orders.filter(
    (o) => o.orderStatus?.toUpperCase() === "DELIVERED"
  ).length;

  // group revenue by date for bar chart
  const revenueByDate = orders.reduce((acc, o) => {
    const date = new Date(o.createdAt).toLocaleDateString();
    acc[date] = (acc[date] || 0) + (o.totalAmount || 0);
    return acc;
  }, {});
  const barData = Object.entries(revenueByDate).map(([date, revenue]) => ({
    date,
    revenue,
  }));

  // data for pie chart (order status)
  const pieData = [
    { name: "Shipping", value: shippingOrders },
    { name: "Delivered", value: deliveredOrders },
  ];

  return (
    <div className="admin-dashboard">
      {/* Filters */}
      <div className="filters">
        <label>
          Status:
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="SHIPPING">Shipping</option>
            <option value="DELIVERED">Delivered</option>
          </select>
        </label>
        <label>
          Date:
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </label>
        <button className="filter-btn" onClick={handleFilterClick}>
          Filter
        </button>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card">
          <h3>Total Orders</h3>
          <p>{totalOrders}</p>
        </div>
        <div className="card">
          <h3>Total Revenue</h3>
          <p>₹{totalRevenue}</p>
        </div>
        <div className="card">
          <h3>Shipping Orders</h3>
          <p>{shippingOrders}</p>
        </div>
        <div className="card">
          <h3>Delivered Orders</h3>
          <p>{deliveredOrders}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-container">
        <div className="chart">
          <h4>Revenue by Date</h4>
          <BarChart width={500} height={300} data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#82ca9d" />
          </BarChart>
        </div>

        <div className="chart">
          <h4>Orders by Status</h4>
          <PieChart width={300} height={300}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
