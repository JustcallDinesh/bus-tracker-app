// bus-tracker-admin-frontend/src/pages/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Bus Tracker Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/routes"
          className="block p-6 bg-white rounded-md shadow-md hover:shadow-lg transition duration-300"
        >
          <h2 className="text-xl font-semibold mb-2">Route Management</h2>
          <p className="text-gray-600">Add, edit, and manage bus routes.</p>
        </Link>

        <Link
          to="/buses"
          className="block p-6 bg-white rounded-md shadow-md hover:shadow-lg transition duration-300"
        >
          <h2 className="text-xl font-semibold mb-2">Bus Management</h2>
          <p className="text-gray-600">
            Add, edit, and manage the fleet of buses.
          </p>
        </Link>

        <Link
          to="/notifications"
          className="block p-6 bg-white rounded-md shadow-md hover:shadow-lg transition duration-300"
        >
          <h2 className="text-xl font-semibold mb-2">
            Notification Management
          </h2>
          <p className="text-gray-600">
            Send and manage notifications to users.
          </p>
        </Link>

        <Link
          to="/admin/users"
          className="block p-6 bg-white rounded-md shadow-md hover:shadow-lg transition duration-300"
        >
          <h2 className="text-xl font-semibold mb-2">Admin User Management</h2>
          <p className="text-gray-600">
            Manage administrator accounts and roles.
          </p>
        </Link>

        <Link
          to="/schedules"
          className="block p-6 bg-white rounded-md shadow-md hover:shadow-lg transition duration-300"
        >
          <h2 className="text-xl font-semibold mb-2">Schedule Management</h2>
          <p className="text-gray-600">
            Define and manage bus schedules for routes.
          </p>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
