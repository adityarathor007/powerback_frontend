import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';
import UserDashboard from './pages/UserDashboard';
import FeederList from "./pages/FeederList";
import FeederInfoPage from "./pages/FeederInfoPage";
import UpdateFeeder from "./pages/UpdateFeeder";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <Router>
      <div className="min-h-screen app-bg text-slate-900">
        <Navbar />
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<AuthPage />} />
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff-dashboard"
              element={
                <ProtectedRoute allowedRoles={["staff"]}>
                  <StaffDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-dashboard"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/feeder/:id"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <FeederInfoPage />
                </ProtectedRoute>
              }
            />
            {/* fallback route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

// export default function App() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <h1 className="text-4xl font-bold text-blue-600 mb-4">Tailwind Works </h1>
//       <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//         Test Button
//       </button>
//     </div>
//   );
// }
