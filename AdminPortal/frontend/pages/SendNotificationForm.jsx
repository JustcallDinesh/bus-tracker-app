// bus-tracker-admin-frontend/src/pages/SendNotificationForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SendNotificationForm() {
  const navigate = useNavigate();
  const [recipientType, setRecipientType] = useState("all");
  const [recipientTarget, setRecipientTarget] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [routesList, setRoutesList] = useState([]);
  const [busesList, setBusesList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [routesError, setRoutesError] = useState("");
  const [loadingBuses, setLoadingBuses] = useState(true);
  const [busesError, setBusesError] = useState("");

  // Replace with actual admin user ID (you'll likely get this from context/auth)
  const [sentBy] = useState("/* Replace with current admin user ID */");

  useEffect(() => {
    const fetchRoutes = async () => {
      setLoadingRoutes(true);
      setRoutesError("");
      try {
        const response = await axios.get("http://localhost:5001/api/routes");
        setRoutesList(response.data);
        setLoadingRoutes(false);
      } catch (error) {
        console.error(
          "Error fetching routes:",
          error.response?.data?.message || error.message
        );
        setRoutesError(
          error.response?.data?.message || "Failed to load routes."
        );
        setLoadingRoutes(false);
      }
    };

    const fetchBuses = async () => {
      setLoadingBuses(true);
      setBusesError("");
      try {
        const response = await axios.get("http://localhost:5001/api/buses");
        setBusesList(response.data);
        setLoadingBuses(false);
      } catch (error) {
        console.error(
          "Error fetching buses:",
          error.response?.data?.message || error.message
        );
        setBusesError(error.response?.data?.message || "Failed to load buses.");
        setLoadingBuses(false);
      }
    };

    fetchRoutes();
    fetchBuses();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "recipientType":
        setRecipientType(value);
        setRecipientTarget("");
        break; // Reset target on type change
      case "recipientTarget":
        setRecipientTarget(value);
        break;
      case "title":
        setTitle(value);
        break;
      case "body":
        setBody(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    const newNotification = {
      recipientType,
      recipientTarget: recipientType === "all" ? null : recipientTarget,
      title,
      body,
      sentBy,
    };

    try {
      const response = await axios.post(
        "http://localhost:5001/api/notifications",
        newNotification
      );
      console.log("Notification sent:", response.data);
      navigate("/notifications");
    } catch (error) {
      console.error(
        "Error sending notification:",
        error.response?.data?.message || error.message
      );
      setErrorMessage(
        error.response?.data?.message || "Failed to send notification."
      );
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Send New Notification</h1>
      {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="recipientType"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Recipient Type:
          </label>
          <select
            id="recipientType"
            name="recipientType"
            value={recipientType}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="all">All Users</option>
            <option value="route">Specific Route</option>
            <option value="bus">Specific Bus</option>
            <option value="user">Specific User</option>
          </select>
        </div>

        {recipientType === "route" && (
          <div>
            <label
              htmlFor="recipientTarget"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Select Route:
            </label>
            <select
              id="recipientTarget"
              name="recipientTarget"
              value={recipientTarget}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select a Route</option>
              {routesList.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.routeName}
                </option>
              ))}
            </select>
            {loadingRoutes && (
              <p className="text-gray-500 text-sm mt-1">Loading routes...</p>
            )}
            {routesError && (
              <p className="text-red-500 text-sm mt-1">{routesError}</p>
            )}
          </div>
        )}
        {recipientType === "bus" && (
          <div>
            <label
              htmlFor="recipientTarget"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Select Bus:
            </label>
            <select
              id="recipientTarget"
              name="recipientTarget"
              value={recipientTarget}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select a Bus</option>
              {busesList.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.registrationNumber} ({b.model})
                </option>
              ))}
            </select>
            {loadingBuses && (
              <p className="text-gray-500 text-sm mt-1">Loading buses...</p>
            )}
            {busesError && (
              <p className="text-red-500 text-sm mt-1">{busesError}</p>
            )}
          </div>
        )}

        {recipientType === "user" && (
          <div>
            <label
              htmlFor="recipientTarget"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Enter User ID:
            </label>
            <input
              type="text"
              id="recipientTarget"
              name="recipientTarget"
              value={recipientTarget}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
        )}

        <div>
          <label
            htmlFor="title"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div>
          <label
            htmlFor="body"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Body:
          </label>
          <textarea
            id="body"
            name="body"
            value={body}
            onChange={handleInputChange}
            rows="4"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Send Notification
          </button>
          <button
            type="button"
            onClick={() => navigate("/notifications")}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default SendNotificationForm;
