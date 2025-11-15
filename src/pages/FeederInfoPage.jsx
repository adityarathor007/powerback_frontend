import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFeederById, assignUserToFeeder, getAllUsers } from "../api/api";

export default function FeederInfoPage() {
  const { id } = useParams();
  const [feeder, setFeeder] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadFeeder();
    loadUsers();
  }, []);

  async function loadFeeder() {
    const res = await getFeederById(id);
    setFeeder(res.data);
  }

  async function loadUsers() {
    const res = await getAllUsers(); // Admin only API
    setUsers(res.data);
  }

  async function handleAssignUser() {
    try {
      await assignUserToFeeder({
        user_id: selectedUser,
        feeder_id: id
      });
      setMessage("User successfully assigned!");
      loadFeeder();
    } catch (err) {
      setMessage("Failed to assign user.");
    }
  }

  if (!feeder) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">
        Feeder Details
      </h1>

      <div className="bg-white shadow-lg rounded-lg p-4 mb-6 border">
        <p><strong>Name:</strong> {feeder.name}</p>
        <p><strong>Area:</strong> {feeder.area}</p>
        <p><strong>Status:</strong> {feeder.status}</p>
        <p><strong>Assigned Staff:</strong> {feeder.assigned_staff?.name || "None"}</p>
      </div>

      {message && (
        <p className="text-green-600 font-semibold mb-4">{message}</p>
      )}

      <h2 className="text-xl font-bold mb-2">Assign User to this Feeder</h2>

      <select
        className="border p-2 w-full rounded mb-3"
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
      >
        <option value="">Select user</option>
        {users
          .filter((u) => u.role === "user")
          .map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.phone})
            </option>
          ))}
      </select>

      <button
        onClick={handleAssignUser}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Assign User
      </button>
      <h2 className="text-xl font-bold mt-6 mb-2">Users Assigned to this Feeder</h2>
      {feeder.assigned_users.length === 0 ? (
            <p className="text-gray-600 italic">No users assigned yet.</p>
            ) : (
            <ul className="list-disc ml-6">
                {feeder.assigned_users.map((u) => (
                <li key={u.id}>
                    {u.name} ({u.phone})
                </li>
                ))}
            </ul>
        )}
    </div>
  );
}
