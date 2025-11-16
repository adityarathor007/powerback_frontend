import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getUserFeeder } from "../api/api";
import { updateFeederStatus } from "../api/api";
import { Edit } from "lucide-react";
import { Table, THead, TH, TR, TD } from "../components/ui/Table";
import StatusPill from "../components/ui/StatusPill";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";

export default function StaffDashboard() {
  const { user } = useContext(AuthContext);

  const [feeders, setFeeders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Update modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedFeeder, setSelectedFeeder] = useState(null);
  const [status, setStatus] = useState("Working");
  const [remarks, setRemarks] = useState("");
  const [expectedRestore, setExpectedRestore] = useState("");

  const [message, setMessage] = useState("");

  // Fetch assigned feeders
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getUserFeeder(); // same API for staff
        setFeeders(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openModal = (feeder) => {
    setSelectedFeeder(feeder);
    setStatus(feeder.status);
    setRemarks("");
    setExpectedRestore(feeder.expected_restore || "");
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await updateFeederStatus({
        feeder_id: selectedFeeder.id,
        status,
        remarks,
        expected_restore: expectedRestore || null
      });

      // Update UI instantly
      const updated = feeders.map((f) =>
        f.id === selectedFeeder.id
          ? { ...f, status, expected_restore: expectedRestore }
          : f
      );
      setFeeders(updated);

      setMessage("Status updated successfully!");
      setShowModal(false);
    } catch (err) {
      console.log(err);
      setMessage("Failed to update feeder status.");
    }
  };

  if (loading) return <div className="p-6">Loading assigned feeders...</div>;

  return (
    <div className="p-2 sm:p-4">

      <h1 className="text-3xl font-bold mb-2 text-blue-700">
        Welcome, {user?.name} (Staff)
      </h1>
      <p className="text-slate-600 mb-6">
        Update the status of feeders assigned to you.
      </p>

      {message && (
        <p className="text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2 font-semibold mb-4">
          {message}
        </p>
      )}

      <Table>
        <table className="w-full border-collapse">
          <THead>
            <TH>Name</TH>
            <TH>Area</TH>
            <TH>Status</TH>
            <TH>Expected Restore</TH>
            <TH>Remarks</TH>
            <TH>Update</TH>
          </THead>
          <tbody>
          {feeders.map((f) => (
            <TR key={f.id}>
              <TD>{f.name}</TD>
              <TD>{f.area}</TD>
              <TD><StatusPill status={f.status} /></TD>
              <TD>{f.expected_restore ? new Date(f.expected_restore).toLocaleString() : "—"}</TD>
              <TD className="text-sm text-slate-700">{f.remarks ? f.remarks : "—"}</TD>
              <TD>
                <button
                  onClick={() => openModal(f)}
                  className="inline-flex items-center justify-center rounded-md px-2 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                >
                  <Edit size={20} />
                </button>
              </TD>
            </TR>
          ))}
          </tbody>
        </table>
      </Table>

      {/* ================= UPDATE STATUS MODAL ================= */}
      {showModal && (
        <Modal title={`Update: ${selectedFeeder.name}`} onClose={() => setShowModal(false)} footer={null}>
          <form onSubmit={handleUpdate}>
            <label className="font-semibold">Status</label>
            <select
              className="border border-slate-300 p-2 w-full mb-3 rounded-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Working">Working</option>
              <option value="Outage">Outage</option>
              <option value="Maintenance">Maintenance</option>
            </select>

            <label className="font-semibold">Remarks (optional)</label>
            <input
              type="text"
              className="border border-slate-300 p-2 w-full mb-3 rounded-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
              placeholder="Reason or notes"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />

            <label className="font-semibold">Expected Restore (optional)</label>
            <input
              type="datetime-local"
              className="border border-slate-300 p-2 w-full mb-4 rounded-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
              value={expectedRestore || ""}
              onChange={(e) => setExpectedRestore(e.target.value)}
            />

            <Button type="submit" className="w-full">
              Update Status
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
}
