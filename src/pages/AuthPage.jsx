import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { loginUser, registerUser, getCurrentUser } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { User, Phone, Lock } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  // handle login
const handleLogin = async (e) => {
    e.preventDefault();
    // console.log("Login button clicked")

    try {
    const res = await loginUser({ phone, password });
    console.log(res)

    localStorage.setItem("token", res.data.access_token);

    const userRes = await getCurrentUser();

    setUser(userRes.data);

    if (userRes.data.role === "admin") navigate("/admin-dashboard");
    else if (userRes.data.role === "staff") navigate("/staff-dashboard");
    else navigate("/user-dashboard");
  } catch (err) {
    console.log("Login error:", err);
    setMessage("Invalid phone or password");
  }
};


  // handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser({ name, phone, password, role });
      setMessage("Registration successful! You can now log in.");
      setIsLogin(true);
    } catch (err) {
      setMessage(err.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
    <div className="flex flex-col md:flex-row items-stretch gap-8 md:gap-14 w-full max-w-6xl">
      <Card className="w-full md:w-[480px] elevated-hover">
        {/* Header Tabs */}
        <div className="flex mb-6 border-b border-slate-200">
          <button
            onClick={() => setIsLogin(true)}
            className={`w-1/2 py-2 font-semibold ${
              isLogin
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`w-1/2 py-2 font-semibold ${
              !isLogin
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Register
          </button>
        </div>

        {/* Form Section */}
        {message && (
          <p
            className={`text-center mb-3 ${
              message.includes("success")
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        {isLogin ? (
          <form onSubmit={handleLogin}>
            <div className="relative mb-3">
              <Phone className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10 border border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 p-2 w-full rounded-md transition"
                required
              />
            </div>
            <div className="relative mb-4">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 border border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 p-2 w-full rounded-md transition"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        ) : (
          // ✅ REGISTER FORM
          <form onSubmit={handleRegister}>
            <div className="relative mb-3">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 border border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 p-2 w-full rounded-md transition"
                required
              />
            </div>
            <div className="relative mb-3">
              <Phone className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10 border border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 p-2 w-full rounded-md transition"
                required
              />
            </div>
            <div className="relative mb-3">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 border border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 p-2 w-full rounded-md transition"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1 text-slate-700">
                Register as
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="border border-slate-300 p-2 w-full rounded-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
              >
                <option value="user">User</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
        )}
      </Card>

        <Card className="w-full elevated-hover">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">PowerBack</h2>
            <p className="text-slate-600 mb-6">
              Real-time electricity outage tracking for your locality.
            </p>

            <div className="grid sm:grid-cols-3 gap-3 mb-6">
              <div className="rounded-lg border border-slate-200 p-3 bg-slate-50">
                <p className="text-sm font-semibold text-slate-800">Users</p>
                <p className="text-xs text-slate-600">View feeder status</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-3 bg-slate-50">
                <p className="text-sm font-semibold text-slate-800">Staff</p>
                <p className="text-xs text-slate-600">Update outage state</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-3 bg-slate-50">
                <p className="text-sm font-semibold text-slate-800">Admins</p>
                <p className="text-xs text-slate-600">Manage mapping</p>
              </div>
            </div>

            <h3 className="font-semibold mb-2 text-slate-900">Demo Login Accounts</h3>

            <ul className="text-md space-y-1 text-slate-700">
                <li><b>Admin:</b> 9238173617 / <b>admin123</b></li>
                <li><b>Staff 1:</b> 9867204107 / test123</li>
                <li><b>Staff 2:</b> 7529025740 / staff123</li>
                <li><b>User 1:</b> 9327320491 / test123</li>
                <li><b>User 2:</b> 7253819452 / user123</li>
                <li><b>User 3:</b> 8708816514 / user123</li>
            </ul>

            <p className="text-xs text-slate-500 mt-3">
                You can also use the register tab to add a new user
            </p>
         </Card>


      </div>
    </div>
  );
}
