import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFeederById, assignUserToFeeder, getAllUsers } from "../api/api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import StatusPill from "../components/ui/StatusPill";

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

  if (!feeder) return <p className="p-4 text-slate-600">Loading...</p>;

  return (
    <div className="p-2 sm:p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-700 mb-2">
        Feeder Details
      </h1>

      <Card className="mb-6">
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="text-slate-700"><strong>Name:</strong> {feeder.name}</div>
          <div className="text-slate-700"><strong>Area:</strong> {feeder.area}</div>
          <div className="text-slate-700 flex items-center gap-2"><strong>Status:</strong> <StatusPill status={feeder.status} /></div>
          <div className="text-slate-700"><strong>Assigned Staff:</strong> {feeder.assigned_staff?.name || "None"}</div>
        </div>
      </Card>

      {message && (
        <p className="text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2 font-semibold mb-4">
          {message}
        </p>
      )}

      <h2 className="text-xl font-bold mb-2">Assign User to this Feeder</h2>

      <select
        className="border border-slate-300 p-2 w-full rounded-md mb-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
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

      <Button onClick={handleAssignUser}>
        Assign User
      </Button>
      <h2 className="text-xl font-bold mt-6 mb-2">Users Assigned to this Feeder</h2>
      {feeder.assigned_users.length === 0 ? (
            <p className="text-slate-600 italic">No users assigned yet.</p>
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
