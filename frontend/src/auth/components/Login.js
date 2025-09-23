import React, { useState, useContext } from "react";
import { login as apiLogin } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateEmailFormat = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!validateEmailFormat(email.trim())) {
      setError("Please enter a valid email");
      return false;
    }
    if (!password.trim()) {
      setError("Password is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { data } = await apiLogin({ email: email.trim(), password });
      login(data.token, data.user);

      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (data.user.role === "doctor") {
        navigate("/doctor/dashboard");
      } else {
        navigate("/patient/records");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Styles for consistent layout and colors
  const labelRowStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: 4,
  };

  const iconStyle = {
    color: "#6366f1", // Indigo consistent with registration icons
    fontSize: 22,
    fontWeight: "700",
    marginRight: 8,
    verticalAlign: "middle",
  };

  const labelTextStyle = {
    fontWeight: "700",
    color: "#000000", // black label text
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 via-blue-100 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-md w-full">
        <h1 className="text-center text-3xl font-bold text-indigo-600 mb-8">
          Hospital Management System
        </h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 max-w-sm mx-auto"
          noValidate
        >
          {/* Email */}
          <label htmlFor="email" style={labelRowStyle}>
            <span style={iconStyle}>
              <Mail />
            </span>
            <span style={labelTextStyle}>Email</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            disabled={loading}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            aria-describedby="emailError"
          />
          {/* Password */}
          <label htmlFor="password" style={labelRowStyle}>
            <span style={iconStyle}>
              <Lock />
            </span>
            <span style={labelTextStyle}>Password</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            disabled={loading}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            aria-describedby="passwordError"
          />
          {error && (
            <p
              id="errorMessage"
              className="text-red-600 text-center"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 hover:underline font-semibold"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
