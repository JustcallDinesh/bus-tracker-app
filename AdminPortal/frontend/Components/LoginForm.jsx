// bus-tracker-admin-frontend/src/components/LoginForm.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function LoginForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/login",
        { username, password }
      );
      console.log("fetching finishing");
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("userRole", response.data.user.role);
      console.log("Login successful:", response.data);
      localStorage.setItem("username", response.data.user.username);
      navigate("/"); // Redirect to the admin users page after login
    } catch (loginError) {
      console.error(
        "Login failed:",
        loginError.response?.data?.message || loginError.message
      );
      setError(
        loginError.response?.data?.message || "Invalid username or password"
      );
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Login
        </button>
        <p className="mt-4 text-sm text-gray-600">
          Dont't have an Account?
          <Link className="text-blue-500 hover:underline" to="/register">
            Register Here
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
