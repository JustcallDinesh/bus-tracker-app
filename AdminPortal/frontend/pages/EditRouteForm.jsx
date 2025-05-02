import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function EditRouteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [routeName, setRouteName] = useState("");
  const [trips, setTrips] = useState([
    {
      busRoute: [
        {
          from: {
            cityName: "",
            departureTime: "",
            latitude: "",
            longitude: "",
          },
          to: { cityName: "", arrivalTime: "", latitude: "", longitude: "" },
        },
      ],
      busStops: [{ name: "", latitude: "", longitude: "" }],
    },
  ]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRoute = async () => {
      setLoading(true);
      setErrorMessage("");
      try {
        const response = await axios.get(
          `http://localhost:5001/api/routes/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        const routeData = response.data;
        console.log(routeData);
        setRouteName(routeData.routeName);
        setTrips(routeData.trips); // Directly set the trips data
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
    };

    fetchRoute();
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "routeName") {
      setRouteName(value);
    }
  };

  const handleTripChange = (tripIndex, event) => {
    const { name, value } = event.target;
    const [nestedField, ...rest] = name.split(".");
    const newTrips = [...trips];

    if (nestedField === "from" || nestedField === "to") {
      const [fromTo, prop] = rest;
      newTrips[tripIndex].busRoute[0][fromTo][prop] = value;
    }

    setTrips(newTrips);
  };

  const handleStopChange = (tripIndex, stopIndex, event) => {
    const { name, value } = event.target;
    const newTrips = [...trips];
    newTrips[tripIndex].busStops[stopIndex][name] = value;
    setTrips(newTrips);
  };

  const addTrip = () => {
    setTrips([
      ...trips,
      {
        busRoute: [
          {
            from: {
              cityName: "",
              departureTime: "",
              latitude: "",
              longitude: "",
            },
            to: { cityName: "", arrivalTime: "", latitude: "", longitude: "" },
          },
        ],
        busStops: [{ name: "", latitude: "", longitude: "" }],
      },
    ]);
  };

  const removeTrip = (tripIndex) => {
    if (trips.length > 1) {
      const newTrips = trips.filter((_, i) => i !== tripIndex);
      setTrips(newTrips);
    }
  };

  const addStop = (tripIndex) => {
    const newTrips = [...trips];
    newTrips[tripIndex].busStops.push({
      name: "",
      latitude: "",
      longitude: "",
    });
    setTrips(newTrips);
  };

  const removeStop = (tripIndex, stopIndex) => {
    const newTrips = [...trips];
    if (newTrips[tripIndex].busStops.length > 1) {
      newTrips[tripIndex].busStops = newTrips[tripIndex].busStops.filter(
        (_, i) => i !== stopIndex
      );
      setTrips(newTrips);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    const updatedRoute = {
      routeName,
      trips,
    };

    try {
      const response = await axios.patch(
        `http://localhost:5001/api/routes/${id}`,
        updatedRoute,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
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
          <h2 className="text-xl font-semibold mb-2">Trips</h2>
          {trips.map((trip, tripIndex) => (
            <div key={tripIndex} className="border p-4 rounded-md mb-4">
              <h3 className="text-lg font-semibold mb-2">
                Trip {tripIndex + 1}
              </h3>

              <div className="mb-2">
                <h4 className="text-md font-semibold mb-1">Bus Route</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">
                      From:
                    </label>
                    <input
                      type="text"
                      name={`from.cityName`}
                      value={trip.busRoute[0].from.cityName}
                      onChange={(event) => handleTripChange(tripIndex, event)}
                      placeholder="City Name"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    <input
                      type="time"
                      name={`from.departureTime`}
                      value={trip.busRoute[0].from.departureTime}
                      onChange={(event) => handleTripChange(tripIndex, event)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1"
                    />
                    <input
                      type="number"
                      name={`from.latitude`}
                      value={trip.busRoute[0].from.latitude}
                      onChange={(event) => handleTripChange(tripIndex, event)}
                      placeholder="Latitude"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1"
                    />
                    <input
                      type="number"
                      name={`from.longitude`}
                      value={trip.busRoute[0].from.longitude}
                      onChange={(event) => handleTripChange(tripIndex, event)}
                      placeholder="Longitude"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">
                      To:
                    </label>
                    <input
                      type="text"
                      name={`to.cityName`}
                      value={trip.busRoute[0].to.cityName}
                      onChange={(event) => handleTripChange(tripIndex, event)}
                      placeholder="City Name"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    <input
                      type="time"
                      name={`to.arrivalTime`}
                      value={trip.busRoute[0].to.arrivalTime}
                      onChange={(event) => handleTripChange(tripIndex, event)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1"
                    />
                    <input
                      type="number"
                      name={`to.latitude`}
                      value={trip.busRoute[0].to.latitude}
                      onChange={(event) => handleTripChange(tripIndex, event)}
                      placeholder="Latitude"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1"
                    />
                    <input
                      type="number"
                      name={`to.longitude`}
                      value={trip.busRoute[0].to.longitude}
                      onChange={(event) => handleTripChange(tripIndex, event)}
                      placeholder="Longitude"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-2">
                <h4 className="text-md font-semibold mb-1">Bus Stops</h4>
                {trip.busStops.map((stop, stopIndex) => (
                  <div
                    key={stopIndex}
                    className="flex space-x-4 mb-2 items-center"
                  >
                    <input
                      type="text"
                      name="name"
                      value={stop.name}
                      onChange={(event) =>
                        handleStopChange(tripIndex, stopIndex, event)
                      }
                      placeholder={`Stop ${stopIndex + 1} Name`}
                      className="shadow appearance-none border rounded w-2/5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                    <input
                      type="number"
                      name="latitude"
                      value={stop.latitude}
                      onChange={(event) =>
                        handleStopChange(tripIndex, stopIndex, event)
                      }
                      placeholder="Latitude"
                      className="shadow appearance-none border rounded w-1/5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                    <input
                      type="number"
                      name="longitude"
                      value={stop.longitude}
                      onChange={(event) =>
                        handleStopChange(tripIndex, stopIndex, event)
                      }
                      placeholder="Longitude"
                      className="shadow appearance-none border rounded w-1/5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                    {trip.busStops.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStop(tripIndex, stopIndex)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addStop(tripIndex)}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Add Stop
                </button>
              </div>

              {trips.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTrip(tripIndex)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
                >
                  Remove Trip
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addTrip}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
          >
            Add Trip
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
