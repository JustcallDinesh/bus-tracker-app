import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../src/services/api";

function AddRouteForm() {
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "routeName") {
      setRouteName(value);
    }
  };

  const handleTripChange = (tripIndex, event) => {
    const { name, value } = event.target;
    const newTrips = [...trips];

    // Handle busRoute changes (assuming only one route segment for simplicity)
    if (name.startsWith("from.cityName")) {
      newTrips[tripIndex].busRoute[0].from.cityName = value;
    } else if (name.startsWith("from.departureTime")) {
      newTrips[tripIndex].busRoute[0].from.departureTime = value;
    } else if (name.startsWith("from.latitude")) {
      newTrips[tripIndex].busRoute[0].from.latitude = value;
    } else if (name.startsWith("from.longitude")) {
      newTrips[tripIndex].busRoute[0].from.longitude = value;
    } else if (name.startsWith("to.cityName")) {
      newTrips[tripIndex].busRoute[0].to.cityName = value;
    } else if (name.startsWith("to.arrivalTime")) {
      newTrips[tripIndex].busRoute[0].to.arrivalTime = value;
    } else if (name.startsWith("to.latitude")) {
      newTrips[tripIndex].busRoute[0].to.latitude = value;
    } else if (name.startsWith("to.longitude")) {
      newTrips[tripIndex].busRoute[0].to.longitude = value;
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

  const removeTrip = (index) => {
    if (trips.length > 1) {
      const newTrips = trips.filter((_, i) => i !== index);
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

    const newRoute = {
      routeName,
      trips,
    };

    try {
      const response = await api.post(
        "http://localhost:5001/api/routes", // Adjust URL if needed
        newRoute,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      console.log("Route saved:", response.data);
      navigate("/routes");
    } catch (error) {
      console.error(
        "Error saving route:",
        error.response?.data?.message || error.message
      );
      setErrorMessage(error.response?.data?.message || "Failed to save route.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Route</h1>
      {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="routeName"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Route Name :
          </label>
          <input
            type="text"
            id="routeName"
            name="routeName"
            value={routeName}
            onChange={handleInputChange}
            className="shadow appearance-none border-[.3px] border-cyan-600 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Trips</h2>
          {trips.map((trip, tripIndex) => (
            <div
              key={tripIndex}
              className="border border-cyan-700 p-4 rounded-md mb-4"
            >
              <h3 className="text-lg font-semibold mb-2">
                Trip {tripIndex + 1}
              </h3>
              <div>
                <h4 className="text-md font-semibold mb-1">Bus Route</h4>
                {trip.busRoute.map((routeSegment, routeIndex) => (
                  <div key={routeIndex} className="grid grid-cols-2 gap-4 mb-2">
                    <div>
                      <label
                        htmlFor={`fromCity-${tripIndex}-${routeIndex}`}
                        className="block text-gray-700 text-sm font-bold mb-2"
                      >
                        From City:
                      </label>
                      <input
                        type="text"
                        id={`fromCity-${tripIndex}-${routeIndex}`}
                        name={`from.cityName-${tripIndex}-${routeIndex}`}
                        value={routeSegment.from?.cityName || ""}
                        onChange={(event) => handleTripChange(tripIndex, event)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`fromTime-${tripIndex}-${routeIndex}`}
                        className="block text-gray-700 text-sm font-bold mb-2"
                      >
                        Departure Time:
                      </label>
                      <input
                        type="time"
                        id={`fromTime-${tripIndex}-${routeIndex}`}
                        name={`from.departureTime-${tripIndex}-${routeIndex}`}
                        value={routeSegment.from?.departureTime || ""}
                        onChange={(event) => handleTripChange(tripIndex, event)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`fromLat-${tripIndex}-${routeIndex}`}
                        className="block text-gray-700 text-sm font-bold mb-2"
                      >
                        From Latitude:
                      </label>
                      <input
                        type="number"
                        id={`fromLat-${tripIndex}-${routeIndex}`}
                        name={`from.latitude-${tripIndex}-${routeIndex}`}
                        value={routeSegment.from?.latitude || ""}
                        onChange={(event) => handleTripChange(tripIndex, event)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`fromLon-${tripIndex}-${routeIndex}`}
                        className="block text-gray-700 text-sm font-bold mb-2"
                      >
                        From Longitude:
                      </label>
                      <input
                        type="number"
                        id={`fromLon-${tripIndex}-${routeIndex}`}
                        name={`from.longitude-${tripIndex}-${routeIndex}`}
                        value={routeSegment.from?.longitude || ""}
                        onChange={(event) => handleTripChange(tripIndex, event)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`toCity-${tripIndex}-${routeIndex}`}
                        className="block text-gray-700 text-sm font-bold mb-2"
                      >
                        To City:
                      </label>
                      <input
                        type="text"
                        id={`toCity-${tripIndex}-${routeIndex}`}
                        name={`to.cityName-${tripIndex}-${routeIndex}`}
                        value={routeSegment.to?.cityName || ""}
                        onChange={(event) => handleTripChange(tripIndex, event)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`toTime-${tripIndex}-${routeIndex}`}
                        className="block text-gray-700 text-sm font-bold mb-2"
                      >
                        Arrival Time:
                      </label>
                      <input
                        type="time"
                        id={`toTime-${tripIndex}-${routeIndex}`}
                        name={`to.arrivalTime-${tripIndex}-${routeIndex}`}
                        value={routeSegment.to?.arrivalTime || ""}
                        onChange={(event) => handleTripChange(tripIndex, event)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`toLat-${tripIndex}-${routeIndex}`}
                        className="block text-gray-700 text-sm font-bold mb-2"
                      >
                        To Latitude:
                      </label>
                      <input
                        type="number"
                        id={`toLat-${tripIndex}-${routeIndex}`}
                        name={`to.latitude-${tripIndex}-${routeIndex}`}
                        value={routeSegment.to?.latitude || ""}
                        onChange={(event) => handleTripChange(tripIndex, event)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`toLon-${tripIndex}-${routeIndex}`}
                        className="block text-gray-700 text-sm font-bold mb-2"
                      >
                        To Longitude:
                      </label>
                      <input
                        type="number"
                        id={`toLon-${tripIndex}-${routeIndex}`}
                        name={`to.longitude-${tripIndex}-${routeIndex}`}
                        value={routeSegment.to?.longitude || ""}
                        onChange={(event) => handleTripChange(tripIndex, event)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="text-md font-semibold mb-1">Bus Stops</h4>
                {trip.busStops.map((stop, stopIndex) => (
                  <div
                    key={stopIndex}
                    className="flex space-x-4 mb-2 items-center"
                  >
                    <div className="w-2/5">
                      <label
                        htmlFor={`stopName-${tripIndex}-${stopIndex}`}
                        className="block text-gray-700 text-sm font-bold mb-2"
                      >
                        Stop {stopIndex + 1} Name:
                      </label>
                      <input
                        type="text"
                        id={`stopName-${tripIndex}-${stopIndex}`}
                        name="name"
                        value={stop.name}
                        onChange={(event) =>
                          handleStopChange(tripIndex, stopIndex, event)
                        }
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>
                    <div className="w-1/5">
                      <label
                        htmlFor={`stopLatitude-${tripIndex}-${stopIndex}`}
                        className="block text-gray-700 text-sm font-bold mb-2"
                      >
                        Latitude:
                      </label>
                      <input
                        type="number"
                        id={`stopLatitude-${tripIndex}-${stopIndex}`}
                        name="latitude"
                        value={stop.latitude}
                        onChange={(event) =>
                          handleStopChange(tripIndex, stopIndex, event)
                        }
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="w-1/5">
                      <label
                        htmlFor={`stopLongitude-${tripIndex}-${stopIndex}`}
                        className="block text-gray-700 text-sm font-bold mb-2"
                      >
                        Longitude:
                      </label>
                      <input
                        type="number"
                        id={`stopLongitude-${tripIndex}-${stopIndex}`}
                        name="longitude"
                        value={stop.longitude}
                        onChange={(event) =>
                          handleStopChange(tripIndex, stopIndex, event)
                        }
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
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
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Trip
          </button>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save Route
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

export default AddRouteForm;
