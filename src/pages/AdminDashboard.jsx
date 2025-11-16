import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getAllFeeders, addNewFeeder, deleteFeeder, getAllStaff, assignStaffToFeeder } from "../api/api";
import { Trash2, UserPlus, ExternalLink, Users, Power, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import { Table, THead, TH, TR, TD } from "../components/ui/Table";
import StatusPill from "../components/ui/StatusPill";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";



export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [feeders, setFeeders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Feeder Form State
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [status, setStatus] = useState("Working");
  const [message, setMessage] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedFeeder, setSelectedFeeder] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");

  // Fetch all feeders
  useEffect(() => {
    const fetchFeeders = async () => {
      try {
        const res = await getAllFeeders();
        setFeeders(res.data);
      } catch (err) {
        // console.log("Error fetching feeders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeeders();
  }, []);

  // Add new feeder submit
  const handleAddFeeder = async (e) => {
    e.preventDefault();

    try {
      const res = await addNewFeeder({
        name,
        area,
        status,
        expected_restore: null,
      });

      setMessage("Feeder added successfully!");

      // refresh list
      setFeeders([...feeders, { name, area, status }]);

      // reset
      setName("");
      setArea("");
      setStatus("Working");
      setShowForm(false);

    } catch (err) {
      console.log("Error adding feeder:", err);
      setMessage("Failed to add feeder.");
    }
  };

  if (loading) return <div className="p-6">Loading feeders...</div>;

//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this feeder?")) return;

//     try {
//         await deleteFeeder({ feeder_id: id });

//         // Remove from frontend list instantly
//         setFeeders(feeders.filter((f) => f.id !== id));

//         setMessage("Feeder deleted successfully.");
//         setTimeout(() => setMessage(""), 2000);
//     } catch (err) {
//         console.log("Delete error:", err);
//         setMessage("Failed to delete feeder.");
//     }
//  };

    const openAssignModal = async (feeder) => {
        setSelectedFeeder(feeder);
        setShowAssignModal(true);

        // load staff list
        try {
            const res = await getAllStaff();
            // console.log("Fetched Staff Data: ",res)
            setStaffList(res.data);
        } catch (err) {
            console.log("Error fetching staff", err);
        }
    };

    const handleAssignStaff = async (e) => {
        e.preventDefault();

        try {
            await assignStaffToFeeder({
            feeder_id: selectedFeeder.id,
            staff_id: selectedStaff
            });

            setMessage("Staff assigned successfully!");

            // update feeder list in UI
            const updated = feeders.map((f) =>
            f.id === selectedFeeder.id
                ? { ...f, staff: staffList.find(s => s.id == selectedStaff) }
                : f
            );

            setFeeders(updated);

            setShowAssignModal(false);
        } catch (err) {
            console.log("Assign error:", err);
            setMessage("Failed to assign staff.");
        }
    };

  const stats = [
    { label: "Total Feeders", value: feeders.length || 0, icon: Power, color: "text-blue-600" },
    { label: "Working", value: feeders.filter(f => f.status === "Working").length, icon: Users, color: "text-green-600" },
    { label: "Outage", value: feeders.filter(f => f.status === "Outage").length, icon: Wrench, color: "text-red-600" },
  ];

  return (
    <div className="p-2 sm:p-4">
      <h1 className="text-3xl font-bold mb-1 text-blue-700">
        Welcome, {user?.name} (Admin)
      </h1>

      <p className="text-slate-600 mb-6">
        Manage all feeders and assign staff.
      </p>

      {/* Success Message */}
      {message && (
        <p className="text-green-600 font-semibold mb-4 bg-green-50 border border-green-200 rounded-md px-3 py-2">
          {message}
        </p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {stats.map((s, idx) => (
          <Card key={idx} className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center ${s.color}`}>
              <s.icon size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-sm text-slate-600">{s.label}</div>
            </div>
          </Card>
        ))}
      </div>


      {/* Feeder List Table */}
      <h2 className="text-2xl font-bold mt-6 mb-3">All Feeders</h2>

      <Table>
        <table className="w-full border-collapse">
          <THead>
            <TH>Name</TH>
            <TH>Area</TH>
            <TH>Status</TH>
            <TH>Staff Assigned</TH>
            <TH>Assign Staff</TH>
            <TH>Details</TH>
          </THead>
          <tbody>
            {feeders.map((f) => (
              <TR key={f.id}>
                <TD>{f.name}</TD>
                <TD>{f.area}</TD>
                <TD><StatusPill status={f.status} /></TD>
                <TD>{f.staff ? f.staff.name : <span className="text-slate-500 italic">Not assigned</span>}</TD>
                <TD>
                  <button
                    onClick={() => openAssignModal(f)}
                    className="inline-flex items-center justify-center rounded-md px-2 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    title="Assign staff"
                  >
                    <UserPlus size={20} />
                  </button>
                </TD>
                <TD>
                  <button
                    onClick={() => navigate(`/feeder/${f.id}`)}
                    className="inline-flex items-center justify-center rounded-md px-2 py-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50"
                    title="View Feeder Info"
                  >
                    <ExternalLink size={20} />
                  </button>
                </TD>
              </TR>
            ))}
          </tbody>
        </table>
      </Table>

      {/* ================== ADD NEW FEEDER BUTTON ================== */}
      <div className="flex justify-center mt-6">
        <Button onClick={() => setShowForm(true)} className="px-6 py-2">
          ➕ Add New Feeder
        </Button>
      </div>

    <div className="flex justify-center">
    <div className="bg-white border border-slate-200 shadow-md rounded-lg p-4 w-full md:w-[520px] mt-4 text-md">
        <h2 className="text-lg font-bold text-blue-700 mb-2">PowerBack Admin Guide</h2>

        <ul className="space-y-2 text-slate-700">
            <li>➕ <b>Add New Feeder</b> → Click the button above to create a feeder.</li>
            <li>👤➕ <b>Assign Staff</b> → Click the UserPlus icon to link a staff member.</li>
            <li>🔗 <b>Feeder Details</b> → Click the link icon to open full feeder info & map users to that feeder.</li>
        </ul>

        </div>
    </div>

    {/* ===================== ADD FEEDER MODAL ===================== */}
    {showForm && (
      <Modal title="Add New Feeder" onClose={() => setShowForm(false)} footer={null}>
          <form onSubmit={handleAddFeeder}>
            <input
              type="text"
              placeholder="Feeder Name"
              className="border border-slate-300 p-2 w-full mb-3 rounded-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Area"
              className="border border-slate-300 p-2 w-full mb-3 rounded-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              required
            />

            <label className="font-semibold">Status</label>
            <select
              className="border border-slate-300 p-2 w-full mb-4 rounded-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Working">Working</option>
              <option value="Outage">Outage</option>
              <option value="Maintenance">Maintenance</option>
            </select>

            <Button type="submit" className="w-full">
              Add Feeder
            </Button>
          </form>
      </Modal>
    )}

    {/* ===================== ASSIGN STAFF MODAL ===================== */}
    {showAssignModal && (
      <Modal title={`Assign Staff to: ${selectedFeeder.name}`} onClose={() => setShowAssignModal(false)} footer={null}>
          <form onSubmit={handleAssignStaff}>
            <label className="font-semibold">Select Staff</label>
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="border border-slate-300 p-2 w-full rounded-md mb-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
              required
            >
              <option value="">Choose Staff</option>
              {staffList.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.name} ({staff.phone})
                </option>
              ))}
            </select>

            <Button type="submit" className="w-full">
              Assign Staff
            </Button>
          </form>
      </Modal>
    )}
    </div>
  );
}
