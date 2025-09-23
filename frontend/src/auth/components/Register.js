import React, { useState } from "react";
import { register } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Phone,
  Home,
  Calendar,
  CalendarClock,
  Droplet,
  UserRound,
} from "lucide-react";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    age: "",
    gender: "",
    bloodGroup: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "patient",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!formData.dob) {
      setError("Date of birth is required");
      return false;
    }
    if (!formData.age || isNaN(formData.age)) {
      setError("Valid age is required");
      return false;
    }
    if (!formData.gender) {
      setError("Gender is required");
      return false;
    }
    if (!formData.bloodGroup) {
      setError("Blood group is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Valid email is required");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setError("");
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;
    setLoading(true);
    try {
      await register(formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container" aria-live="polite">
      <h1>MedManageX Registration</h1>
      <form onSubmit={handleSubmit} noValidate>
        {/* Full Name */}
        <label htmlFor="fullName">
          <span className="label-row">
            <span className="icon">
              <User />
            </span>
            <span className="label-text">Full Name</span>
          </span>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            placeholder="Enter your full name"
            onChange={handleChange}
            disabled={loading}
            required
            aria-required="true"
          />
        </label>

        {/* Date of Birth */}
        <label htmlFor="dob">
          <span className="label-row">
            <span className="icon">
              <Calendar />
            </span>
            <span className="label-text">Date of Birth</span>
          </span>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            disabled={loading}
            required
            aria-required="true"
          />
        </label>

        {/* Age */}
        <label htmlFor="age">
          <span className="label-row">
            <span className="icon">
              <CalendarClock />
            </span>
            <span className="label-text">Age</span>
          </span>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            min="0"
            placeholder="Enter your age"
            onChange={handleChange}
            disabled={loading}
            required
            aria-required="true"
          />
        </label>

        {/* Gender */}
        <label htmlFor="gender">
          <span className="label-row">
            <span className="icon">
              <UserRound />
            </span>
            <span className="label-text">Gender</span>
          </span>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            disabled={loading}
            required
            aria-required="true"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>

        {/* Blood Group */}
        <label htmlFor="bloodGroup">
          <span className="label-row">
            <span className="icon">
              <Droplet />
            </span>
            <span className="label-text">Blood Group</span>
          </span>
          <select
            id="bloodGroup"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            disabled={loading}
            required
            aria-required="true"
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </label>

        {/* Email */}
        <label htmlFor="email">
          <span className="label-row">
            <span className="icon">
              <Mail />
            </span>
            <span className="label-text">Email</span>
          </span>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            placeholder="Enter your email"
            onChange={handleChange}
            disabled={loading}
            required
            aria-required="true"
          />
        </label>

        {/* Password */}
        <label htmlFor="password">
          <span className="label-row">
            <span className="icon">
              <Lock />
            </span>
            <span className="label-text">Password</span>
          </span>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            placeholder="Enter a strong password"
            onChange={handleChange}
            disabled={loading}
            required
            aria-required="true"
          />
        </label>

        {/* Phone (optional) */}
        <label htmlFor="phone">
          <span className="label-row">
            <span className="icon">
              <Phone />
            </span>
            <span className="label-text">Phone (Optional)</span>
          </span>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            placeholder="Enter your phone number"
            onChange={handleChange}
            disabled={loading}
          />
        </label>

        {/* Address (optional) */}
        <label htmlFor="address">
          <span className="label-row">
            <span className="icon">
              <Home />
            </span>
            <span className="label-text">Address (Optional)</span>
          </span>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            placeholder="Enter your address"
            onChange={handleChange}
            disabled={loading}
          />
        </label>

        {/* Hidden Role */}
        <input type="hidden" name="role" value="patient" />

        <button type="submit" disabled={loading} aria-busy={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        {error && (
          <p className="error-msg" role="alert" aria-live="assertive">
            {error}
          </p>
        )}
      </form>

      <p>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
      <p>
        Are you a doctor? <Link to="/register-doctor">Register here</Link>
      </p>
    </div>
  );
};

export default Register;
