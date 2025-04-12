// bus-tracker-admin-frontend/src/pages/UnapprovedUsersPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

function UnapprovedUsersPage() {
  const [unapprovedUsers, setUnapprovedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUnapprovedUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "http://localhost:5001/api/admin/users/unapproved",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUnapprovedUsers(response.data);
        setLoading(false);
      } catch (err) {
        console.error(
          "Error fetching unapproved users:",
          err.response?.data?.message || err.message
        );
        setError(
          err.response?.data?.message || "Failed to fetch unapproved users"
        );
        setLoading(false);
      }
    };

    fetchUnapprovedUsers();
  }, []);

  const handleApproveReject = async (userId, approved) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.patch(
        `http://localhost:5001/api/admin/users/${userId}/approval`,
        { approved },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh the list of unapproved users after approval/rejection
      setUnapprovedUsers(unapprovedUsers.filter((user) => user._id !== userId));
    } catch (err) {
      console.error(
        "Error approving/rejecting user:",
        err.response?.data?.message || err.message
      );
      setError(err.response?.data?.message || "Failed to approve/reject user");
    }
  };

  if (loading) {
    return <div>Loading unapproved users...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Unapproved Admin Users</h1>
      {unapprovedUsers.length === 0 ? (
        <p>No pending admin user approvals.</p>
      ) : (
        <ul className="list-disc list-inside">
          {unapprovedUsers.map((user) => (
            <li key={user._id} className="mb-2">
              {user.username} ({user.email}) - Role: {user.role}
              <button
                onClick={() => handleApproveReject(user._id, true)}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded ml-2"
              >
                Approve
              </button>
              <button
                onClick={() => handleApproveReject(user._id, false)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2"
              >
                Reject
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UnapprovedUsersPage;
