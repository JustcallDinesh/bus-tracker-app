// bus-tracker-admin-frontend/src/pages/EditAdminUserForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function EditAdminUserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminUser = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(
          `http://localhost:5000/api/admin/users/${id}`
        );
        const userData = response.data;
        setUsername(userData.username);
        setEmail(userData.email);
        setRoles(userData.roles);
        setLoading(false);
      } catch (error) {
        console.error(
          "Error fetching admin user:",
          error.response?.data?.message || error.message
        );
        setError(
          error.response?.data?.message ||
            "Failed to load admin user for editing."
        );
        setLoading(false);
      }
    };

    fetchAdminUser();
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "username":
        setUsername(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const handleRoleChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setRoles([...roles, value]);
    } else {
      setRoles(roles.filter((role) => role !== value));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    const updatedAdminUser = {
      username,
      email,
      password: password || undefined, // Only send password if it's been changed
      roles,
    };

    try {
      const response = await axios.patch(
        `http://localhost:5000/api/admin/users/${id}`,
        updatedAdminUser
      );
      console.log("Admin user updated:", response.data);
      navigate("/admin/users");
    } catch (error) {
      console.error(
        "Error updating admin user:",
        error.response?.data?.message || error.message
      );
      setErrorMessage(
        error.response?.data?.message || "Failed to update admin user."
      );
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">Loading admin user data...</div>
    );
  }

  if (error) {
    return <div className="container mx-auto p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Admin User</h1>
      {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
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
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            New Password (optional):
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <p className="text-gray-500 text-sm mt-1">
            Leave blank to keep the current password.
          </p>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Roles:
          </label>
          <div className="space-y-2">
            <div>
              <input
                type="checkbox"
                id="role-superadmin"
                name="roles"
                value="superadmin"
                checked={roles.includes("superadmin")}
                onChange={handleRoleChange}
              />
              <label
                htmlFor="role-superadmin"
                className="ml-2 text-gray-700 text-sm"
              >
                Super Admin
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="role-admin"
                name="roles"
                value="admin"
                checked={roles.includes("admin")}
                onChange={handleRoleChange}
              />
              <label
                htmlFor="role-admin"
                className="ml-2 text-gray-700 text-sm"
              >
                Admin
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="role-editor"
                name="roles"
                value="editor"
                checked={roles.includes("editor")}
                onChange={handleRoleChange}
              />
              <label
                htmlFor="role-editor"
                className="ml-2 text-gray-700 text-sm"
              >
                Editor
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="role-viewer"
                name="roles"
                value="viewer"
                checked={roles.includes("viewer")}
                onChange={handleRoleChange}
              />
              <label
                htmlFor="role-viewer"
                className="ml-2 text-gray-700 text-sm"
              >
                Viewer
              </label>
            </div>
          </div>
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
            onClick={() => navigate("/admin/users")}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditAdminUserForm;
