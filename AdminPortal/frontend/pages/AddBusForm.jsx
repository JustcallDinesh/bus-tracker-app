import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddBusForm() {
  const navigate = useNavigate();
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [busName, setBusName] = useState("");
  const [model, setModel] = useState("");
  const [capacity, setCapacity] = useState("");
  const [route, setRoute] = useState("");
  const [routesList, setRoutesList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [routesError, setRoutesError] = useState("");

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

    fetchRoutes();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "registrationNumber":
        setRegistrationNumber(value);
        break;
      case "busName":
        setBusName(value);
        break;
      case "model":
        setModel(value);
        break;
      case "capacity":
        setCapacity(value);
        break;
      case "route":
        setRoute(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    const newBus = {
      registrationNumber,
      busName,
      model,
      capacity: parseInt(capacity, 10),
      assignedRoute: route,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/buses",
        newBus
      );
      console.log("Bus saved:", response.data);
      navigate("/buses");
    } catch (error) {
      console.error(
        "Error saving bus:",
        error.response?.data?.message || error.message
      );
      setErrorMessage(error.response?.data?.message || "Failed to save bus.");
    }
  };

  if (loadingRoutes) {
    return <div className="container mx-auto p-6">Loading routes...</div>;
  }

  if (routesError) {
    return (
      <div className="container mx-auto p-6 text-red-500">{routesError}</div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Bus</h1>
      {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="registrationNumber"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Registration Number:
          </label>
          <input
            type="text"
            id="registrationNumber"
            name="registrationNumber"
            value={registrationNumber}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div>
          <label
            htmlFor="busName"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Bus Name:
          </label>
          <input
            type="text"
            id="busName"
            name="busName"
            value={busName}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div>
          <label
            htmlFor="model"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Model:
          </label>
          <input
            type="text"
            id="model"
            name="model"
            value={model}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div>
          <label
            htmlFor="capacity"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Capacity:
          </label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            value={capacity}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div>
          <label
            htmlFor="route"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Assigned Route:
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
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save Bus
          </button>
          <button
            type="button"
            onClick={() => navigate("/buses")}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddBusForm;
