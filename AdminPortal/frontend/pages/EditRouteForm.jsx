import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function EditRouteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [routeName, setRouteName] = useState("");
  const [originName, setOriginName] = useState("");
  const [originLatitude, setOriginLatitude] = useState("");
  const [originLongitude, setOriginLongitude] = useState("");
  const [destinationName, setDestinationName] = useState("");
  const [destinationLatitude, setDestinationLatitude] = useState("");
  const [destinationLongitude, setDestinationLongitude] = useState("");
  const [stops, setStops] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRoute = async () => {
      setLoading(true);
      setErrorMessage("");
      try {
        const response = await axios.get(
          `http://localhost:5000/api/routes/${id}`
        );
        const routeData = response.data;
        setRouteName(routeData.routeName);
        setOriginName(routeData.origin.name);
        setOriginLatitude(routeData.origin.coordinates.latitude);
        setOriginLongitude(routeData.origin.coordinates.longitude);
        setDestinationName(routeData.destination.name);
        setDestinationLatitude(routeData.destination.coordinates.latitude);
        setDestinationLongitude(routeData.destination.coordinates.longitude);
        console.log(routeData);

        setStops(routeData.stops.sort((a, b) => a.order - b.order)); // Ensure stops are ordered

        setLoading(false);
      } catch (error) {
        console.error(
          "Error fetching route:",
          error.response?.data?.message || error.message
        );
        setErrorMessage(
          error.response?.data?.message || "Failed to load route for editing."
        );
        setLoading(false);
      }
      setLoading(false);
    };

    fetchRoute();
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "routeName":
        setRouteName(value);
        break;
      case "originName":
        setOriginName(value);
        break;
      case "originLatitude":
        setOriginLatitude(value);
        break;
      case "originLongitude":
        setOriginLongitude(value);
        break;
      case "destinationName":
        setDestinationName(value);
        break;
      case "destinationLatitude":
        setDestinationLatitude(value);
        break;
      case "destinationLongitude":
        setDestinationLongitude(value);
        break;
      default:
        break;
    }
  };

  const handleStopChange = (index, event) => {
    const { name, value } = event.target;
    const newStops = [...stops];
    newStops[index][name] = value;
    setStops(newStops);
  };

  const addStop = () => {
    setStops([
      ...stops,
      { name: "", latitude: "", longitude: "", order: stops.length + 1 },
    ]);
  };

  const removeStop = (index) => {
    if (stops.length > 1) {
      const newStops = stops.filter((_, i) => i !== index);
      setStops(newStops.map((stop, i) => ({ ...stop, order: i + 1 })));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    const updatedRoute = {
      routeName,
      origin: {
        name: originName,
        coordinates: {
          latitude: parseFloat(originLatitude),
          longitude: parseFloat(originLongitude),
        },
      },
      destination: {
        name: destinationName,
        coordinates: {
          latitude: parseFloat(destinationLatitude),
          longitude: parseFloat(destinationLongitude),
        },
      },
      stops: stops.map((stop, index) => ({
        ...stop, // Keep existing _id if it exists
        coordinates: {
          latitude: parseFloat(stop.latitude),
          longitude: parseFloat(stop.longitude),
        },
        order: index + 1,
      })),
    };

    try {
      const response = await axios.patch(
        `http://localhost:5000/api/routes/${id}`,
        updatedRoute
      );
      console.log("Route updated:", response.data);
      navigate("/routes");
    } catch (error) {
      console.error(
        "Error updating route:",
        error.response?.data?.message || error.message
      );
      setErrorMessage(
        error.response?.data?.message || "Failed to update route."
      );
    }
  };

  if (loading) {
    return <div className="container mx-auto p-6">Loading route data...</div>;
  }

  if (errorMessage) {
    return (
      <div className="container mx-auto p-6 text-red-500">{errorMessage}</div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Route</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="routeName"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Route Name:
          </label>
          <input
            type="text"
            id="routeName"
            name="routeName"
            value={routeName}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Origin</h2>
          <div>
            <label
              htmlFor="originName"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Name:
            </label>
            <input
              type="text"
              id="originName"
              name="originName"
              value={originName}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label
                htmlFor="originLatitude"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Latitude:
              </label>
              <input
                type="number"
                id="originLatitude"
                name="originLatitude"
                value={originLatitude}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="w-1/2">
              <label
                htmlFor="originLongitude"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Longitude:
              </label>
              <input
                type="number"
                id="originLongitude"
                name="originLongitude"
                value={originLongitude}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Destination</h2>
          <div>
            <label
              htmlFor="destinationName"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Name:
            </label>
            <input
              type="text"
              id="destinationName"
              name="destinationName"
              value={destinationName}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label
                htmlFor="destinationLatitude"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Latitude:
              </label>
              <input
                type="number"
                id="destinationLatitude"
                name="destinationLatitude"
                value={destinationLatitude}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="w-1/2">
              <label
                htmlFor="destinationLongitude"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Longitude:
              </label>
              <input
                type="number"
                id="destinationLongitude"
                name="destinationLongitude"
                value={destinationLongitude}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Stops</h2>
          {stops.map((stop, index) => (
            <div
              key={stop._id || index}
              className="flex space-x-4 mb-2 items-center"
            >
              <div className="w-2/5">
                <label
                  htmlFor={`stopName-${index}`}
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Stop {index + 1} Name:
                </label>
                <input
                  type="text"
                  id={`stopName-${index}`}
                  name="name"
                  value={stop.name}
                  onChange={(event) => handleStopChange(index, event)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="w-1/5">
                <label
                  htmlFor={`stopLatitude-${index}`}
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Latitude:
                </label>
                <input
                  type="number"
                  id={`stopLatitude-${index}`}
                  name="latitude"
                  value={stop.latitude}
                  onChange={(event) => handleStopChange(index, event)}
                  className="shadow  border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="w-1/5">
                <label
                  htmlFor={`stopLongitude-${index}`}
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Longitude:
                </label>
                <input
                  type="number"
                  id={`stopLongitude-${index}`}
                  name="longitude"
                  value={stop.longitude}
                  onChange={(event) => handleStopChange(index, event)}
                  className="shadow  border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              {stops.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStop(index)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addStop}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Stop
          </button>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate("/routes")}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditRouteForm;
