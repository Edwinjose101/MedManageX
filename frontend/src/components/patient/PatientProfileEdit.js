import React, { useState, useEffect, useContext } from "react";
import axios from "../../api/axios";
import { AuthContext } from "../../auth/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { MdPerson, MdEmail, MdPhone, MdHome } from "react-icons/md";

const PatientProfileEdit = () => {
  const { user, token, login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.put("/patient/profile", formData);
      login(token, response.data);
      navigate("/patient/profile");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to update profile.";
      setError(errorMsg);
    }
    setLoading(false);
  };

  const containerStyle = {
    background: "#fff",
    maxWidth: 480,
    margin: "70px auto",
    padding: "42px 38px 32px 38px",
    borderRadius: 16,
    boxShadow: "0 8px 32px rgba(60,80,190,0.08)",
    fontFamily: "Segoe UI, Arial, sans-serif",
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const fieldRow = {
    display: "flex",
    alignItems: "center",
    width: "80%",
    maxWidth: 380,
    marginBottom: 24,
    borderRadius: 8,
    background: "#f6f8fa",
    border: "1px solid #dbe2ea",
    padding: "0 18px",
    boxSizing: "border-box",
    minHeight: 48,
  };

  const iconStyle = {
    color: "#2563eb",
    fontSize: 22,
    marginRight: 26,
    flexShrink: 0,
  };

  const inputStyle = {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: 16,
    fontFamily: "inherit",
    padding: "12px 0",
  };

  const textareaStyle = {
    ...inputStyle,
    resize: "vertical",
    minHeight: 48,
  };

  const buttonStyle = {
    width: "80%",
    maxWidth: 380,
    margin: "20px auto 0 auto",
    background: "linear-gradient(90deg,#6366f1 30%,#4338ca 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "14px",
    fontSize: 18,
    fontWeight: 600,
    boxShadow: "0 2px 8px rgba(99,102,241,0.07)",
    cursor: loading ? "not-allowed" : "pointer",
    transition: "background 0.2s",
  };

  return (
    <div style={containerStyle}>
      <h2
        style={{
          fontWeight: 700,
          marginBottom: 36,
          textAlign: "center",
          fontSize: 28,
        }}
      >
        Edit Profile
      </h2>
      <form onSubmit={handleSubmit} autoComplete="off" style={formStyle}>
        <div style={fieldRow}>
          <MdPerson style={iconStyle} />
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="Full Name"
          />
        </div>
        <div style={fieldRow}>
          <MdEmail style={iconStyle} />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="Email"
          />
        </div>
        <div style={fieldRow}>
          <MdPhone style={iconStyle} />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Phone"
          />
        </div>
        <div style={fieldRow}>
          <MdHome style={iconStyle} />
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={2}
            style={textareaStyle}
            placeholder="Address"
          />
        </div>

        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
        {error && (
          <p style={{ color: "red", marginTop: 12, textAlign: "center" }}>
            {error}
          </p>
        )}
      </form>
    </div>
  );
};

export default PatientProfileEdit;
