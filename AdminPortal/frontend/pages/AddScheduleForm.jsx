// bus-tracker-admin-frontend/src/pages/AddScheduleForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddScheduleForm() {
  const navigate = useNavigate();
  const [route, setRoute] = useState("");
  const [departureTimesInput, setDepartureTimesInput] = useState("");
  const [departureTimes, setDepartureTimes] = useState([]);
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [assignedBus, setAssignedBus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [routesList, setRoutesList] = useState([]);
  const [busesList, setBusesList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [routesError, setRoutesError] = useState("");
  const [loadingBuses, setLoadingBuses] = useState(true);
  const [busesError, setBusesError] = useState("");

  useEffect(() => {
    const fetchRoutes = async () => {
      setLoadingRoutes(true);
      setRoutesError("");
      try {
        const response = await axios.get("http://localhost:5000/api/routes");
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
        const response = await axios.get("http://localhost:5000/api/buses");
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
      case "route":
        setRoute(value);
        break;
      case "departureTimesInput":
        setDepartureTimesInput(value);
        break;
      case "assignedBus":
        setAssignedBus(value);
        break;
      case "startDate":
        setStartDate(value);
        break;
      case "endDate":
        setEndDate(value);
        break;
      case "notes":
        setNotes(value);
        break;
      default:
        break;
    }
  };

  const handleAddDepartureTime = () => {
    if (departureTimesInput.trim()) {
      setDepartureTimes([...departureTimes, departureTimesInput.trim()]);
      setDepartureTimesInput("");
    }
  };

  const handleRemoveDepartureTime = (index) => {
    const newTimes = [...departureTimes];
    newTimes.splice(index, 1);
    setDepartureTimes(newTimes);
  };

  const handleDayOfWeekChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setDaysOfWeek([...daysOfWeek, value]);
    } else {
      setDaysOfWeek(daysOfWeek.filter((day) => day !== value));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    const newSchedule = {
      route,
      departureTimes,
      daysOfWeek,
      assignedBus: assignedBus || null,
      startDate: startDate || null,
      endDate: endDate || null,
      notes,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/schedules",
        newSchedule
      );
      console.log("Schedule saved:", response.data);
      navigate("/schedules");
    } catch (error) {
      console.error(
        "Error saving schedule:",
        error.response?.data?.message || error.message
      );
      setErrorMessage(
        error.response?.data?.message || "Failed to save schedule."
      );
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Schedule</h1>
      {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="route"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Route:
          </label>
          <select
            id="route"
            name="route"
            value={route}
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

        <div>
          <label
            htmlFor="departureTimesInput"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Departure Times (HH:mm):
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              id="departureTimesInput"
              name="departureTimesInput"
              value={departureTimesInput}
              onChange={handleInputChange}
              placeholder="e.g., 08:00"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <button
              type="button"
              onClick={handleAddDepartureTime}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add
            </button>
          </div>
          {departureTimes.length > 0 && (
            <div className="mt-2">
              <span className="block text-gray-700 text-sm font-bold mb-1">
                Departure Times:
              </span>
              <ul className="list-disc list-inside">
                {departureTimes.map((time, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    {time}
                    <button
                      type="button"
                      onClick={() => handleRemoveDepartureTime(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Days of Week:
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => (
              <div key={day}>
                <input
                  type="checkbox"
                  id={`day-${day}`}
                  name="daysOfWeek"
                  value={day}
                  checked={daysOfWeek.includes(day)}
                  onChange={handleDayOfWeekChange}
                  className="mr-2"
                />
                <label htmlFor={`day-${day}`} className="text-gray-700 text-sm">
                  {day}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="assignedBus"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Assigned Bus (Optional):
          </label>
          <select
            id="assignedBus"
            name="assignedBus"
            value={assignedBus}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select a Bus</option>
            {busesList.map((bus) => (
              <option key={bus._id} value={bus._id}>
                {bus.registrationNumber} ({bus.model})
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

        <div>
          <label
            htmlFor="startDate"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Start Date (Optional):
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={startDate}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div>
          <label
            htmlFor="endDate"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            End Date (Optional):
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={endDate}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div>
          <label
            htmlFor="notes"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Notes (Optional):
          </label>
          <textarea
            id="notes"
            name="notes"
            value={notes}
            onChange={handleInputChange}
            rows="3"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save Schedule
          </button>
          <button
            type="button"
            onClick={() => navigate("/schedules")}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddScheduleForm;
