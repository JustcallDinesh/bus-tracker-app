// bus-tracker-admin-frontend/src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      const storedAuthToken = localStorage.getItem("authToken");
      if (!storedAuthToken) {
        navigate("/login"); // Redirect to login if no token
      }
      // If you have user details in the token or a separate API call, you might fetch it here
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username"); // Clear username as well
    navigate("/login");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex  justify-between align-baseline  shadow-md mb-5">
        <h1 className="text-2xl text-center font-bold ">
          Bus Tracker Admin Dashboard
        </h1>
        <div className="container mx-auto p-6">
          {username && (
            <p className="text-lg text-center ">
              Welcome, <span className="font-semibold italic">{username}</span>!
            </p>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="bg-green-100 px-2 cursor-pointer text-md font-semibold hover:bg-green-300 transition-colors rounded-tr-md rounded-br-md"
        >
          Logout
        </button>
      </div>

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
