// bus-tracker-admin-frontend/src/pages/SchedulesPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function SchedulesPage() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [scheduleToDeleteId, setScheduleToDeleteId] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState("");

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(
          "http://localhost:5001/api/schedules",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setSchedules(response.data);
        setLoading(false);
      } catch (error) {
        console.error(
          "Error fetching schedules:",
          error.response?.data?.message || error.message
        );
        setError(error.response?.data?.message || "Failed to load schedules.");
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const handleDelete = (id) => {
    setScheduleToDeleteId(id);
    setDeleteConfirmationOpen(true);
  };

  const confirmDelete = async () => {
    setDeleteConfirmationOpen(false);
    setDeleteError("");
    setDeleteSuccessMessage("");

    try {
      await axios.delete(
        `http://localhost:5001/api/schedules/${scheduleToDeleteId}`
      );
      setSchedules(
        schedules.filter((schedule) => schedule._id !== scheduleToDeleteId)
      );
      setDeleteSuccessMessage("Schedule deleted successfully.");
    } catch (error) {
      console.error(
        "Error deleting schedule:",
        error.response?.data?.message || error.message
      );
      setDeleteError(
        error.response?.data?.message || "Failed to delete schedule."
      );
    } finally {
      setScheduleToDeleteId(null);
      setTimeout(() => setDeleteSuccessMessage(""), 3000);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmationOpen(false);
    setScheduleToDeleteId(null);
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading schedules...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Schedule Management</h1>
        <Link
          to="/schedules/add"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Schedule
        </Link>
      </div>

      {deleteSuccessMessage && (
        <div className="bg-green-200 text-green-800 py-2 px-4 mb-4 rounded">
          {deleteSuccessMessage}
        </div>
      )}
      {deleteError && (
        <div className="bg-red-200 text-red-800 py-2 px-4 mb-4 rounded">
          {deleteError}
        </div>
      )}

      {deleteConfirmationOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <p className="mb-4">
              Are you sure you want to delete this schedule?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Route
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Departure Times
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Days of Week
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Assigned Bus
              </th>
              {/* Optional: Add columns for Start Date, End Date, Notes */}
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {schedules.map((schedule) => (
              <tr key={schedule._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {schedule._id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {schedule.route?.routeName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {schedule.departureTimes.join(", ")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {schedule.daysOfWeek.join(", ")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {schedule.assignedBus?.registrationNumber || "N/A"}
                </td>
                {/* Optional: Display other schedule details */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    to={`/schedules/edit/${schedule._id}`}
                    className="text-indigo-600 hover:text-indigo-900 mr-2"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(schedule._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SchedulesPage;
