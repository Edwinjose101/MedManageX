import React, { useState, useEffect, useContext } from "react";
import axios from "../../api/axios";
import { AuthContext } from "../../auth/context/AuthContext";

const ScheduleAppointment = () => {
  // State for slot counts and suggestions
  const [slotCounts, setSlotCounts] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const { user } = useContext(AuthContext);

  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [formData, setFormData] = useState({
    department: "",
    doctorId: "",
    date: "",
    time: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Helper to check if a date is Sunday
  const isSunday = (dateStr) => {
    const date = new Date(dateStr);
    return date.getDay() === 0;
  };

  // Helper to check if date is within 5 days in future
  const isWithinFiveDays = (dateStr) => {
    const today = new Date();
    const selected = new Date(dateStr);
    const diff = (selected - today) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 5;
  };

  // Generate 30-min slots from 10:00 to 15:00 excluding 12:30-13:30
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 10;
    const endHour = 15;
    const lunchStart = 12.5; // 12:30
    const lunchEnd = 13.5; // 13:30

    for (let hour = startHour; hour < endHour; hour += 0.5) {
      if (hour >= lunchStart && hour < lunchEnd) continue;
      const h = Math.floor(hour);
      const m = hour % 1 === 0 ? "00" : "30";
      slots.push(`${h.toString().padStart(2, "0")}:${m}`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Fetch slot counts for selected doctor and date
  useEffect(() => {
    if (!formData.doctorId || !formData.date) {
      setSlotCounts({});
      return;
    }
    const fetchSlotCounts = async () => {
      try {
        const res = await axios.get(`appointments/doctor/${formData.doctorId}/slotCounts?date=${formData.date}`);
        setSlotCounts(res.data.slotCounts || {});
      } catch {
        setSlotCounts({});
      }
    };
    fetchSlotCounts();
  }, [formData.doctorId, formData.date]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const depRes = await axios.get("departments");
        const docRes = await axios.get("doctors");
        setDepartments(depRes.data.departments);
        setDoctors(docRes.data.doctors);
      } catch {
        setErrorMsg("Failed to load departments or doctors");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.department) {
      const filtered = doctors.filter(
        (doc) => doc.department === formData.department
      );
      setFilteredDoctors(filtered);
      setFormData((prev) => ({ ...prev, doctorId: "" }));
    }
  }, [formData.department, doctors]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user._id) {
      setErrorMsg("User not logged in");
      return;
    }
    // Validate date: not Sunday, within 5 days
    if (!formData.date) {
      setErrorMsg("Please select a date");
      return;
    }
    if (isSunday(formData.date)) {
      setErrorMsg("Appointments cannot be booked on Sundays.");
      return;
    }
    if (!isWithinFiveDays(formData.date)) {
      setErrorMsg("Appointments can only be booked up to 5 days in advance.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await axios.post("appointments", {
        ...formData,
        patientId: user._id,
      });
      setSuccessMsg("Appointment booked successfully");
      setFormData({
        department: "",
        doctorId: "",
        date: "",
        time: "",
        reason: "",
      });
      setFilteredDoctors([]);
      setSuggestions([]);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Failed to book appointment");
      // Suggest alternative times if slot is full or rule blocks
      if (formData.doctorId && formData.date) {
        try {
          const res = await axios.get(`appointments/doctor/${formData.doctorId}/slotCounts?date=${formData.date}`);
          const counts = res.data.slotCounts || {};
          const available = timeSlots.filter(t => (counts[t] || 0) < 3);
          setSuggestions(available);
        } catch {
          setSuggestions([]);
        }
      }
      // Suggest other doctors in same department if all slots are full
      if (filteredDoctors.length > 1 && suggestions.length === 0) {
        setSuggestions(filteredDoctors.filter(d => d._id !== formData.doctorId).map(d => d.fullName));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="appointment-card">
      <h2>Schedule Appointment</h2>
      <form onSubmit={handleSubmit}>
        <label className="form-label" htmlFor="department">
          Department
        </label>
        <select
          id="department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="form-select"
          required
        >
          <option value="">-- Select Department --</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <label className="form-label" htmlFor="doctorId">
          Doctor
        </label>
        <select
          id="doctorId"
          name="doctorId"
          value={formData.doctorId}
          onChange={handleChange}
          className="form-select"
          disabled={!formData.department}
          required
        >
          <option value="">-- Select Doctor --</option>
          {filteredDoctors.map((doc) => (
            <option key={doc._id} value={doc._id}>
              {doc.fullName}
            </option>
          ))}
        </select>

        <label className="form-label" htmlFor="date">
          Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          min={new Date().toISOString().split("T")[0]}
          max={(() => {
            const today = new Date();
            const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5);
            return maxDate.toISOString().split("T")[0];
          })()}
          onChange={handleChange}
          className="form-input"
          required
        />
        {formData.date && isSunday(formData.date) && (
          <p className="form-error">Appointments cannot be booked on Sundays.</p>
        )}

        <label className="form-label" htmlFor="time">
          Time
        </label>
        <select
          id="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="form-select"
          required
        >
          <option value="">-- Select Time Slot --</option>
          {timeSlots.map((time) => {
            const count = slotCounts[time] || 0;
            const disabled = count >= 3;
            return (
              <option key={time} value={time} disabled={disabled} style={{ color: disabled ? "#aaa" : "#222" }}>
                {time} {disabled ? "(Full)" : `(Available: ${3 - count})`}
              </option>
            );
          })}
        </select>

        <label className="form-label" htmlFor="reason">
          Reason (Optional)
        </label>
        <textarea
          id="reason"
          name="reason"
          value={formData.reason}
          rows={4}
          placeholder="Provide additional information (optional)"
          onChange={handleChange}
          className="form-textarea"
        />

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Booking..." : "Book Appointment"}
        </button>
      </form>
      {successMsg && <p className="form-success">{successMsg}</p>}
      {errorMsg && <p className="form-error">{errorMsg}</p>}
      {suggestions.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <strong>Suggested alternatives:</strong>
          <ul>
            {suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ScheduleAppointment;
