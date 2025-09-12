const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    dob: { type: Date, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: true,
    },

    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    role: {
      type: String,
      enum: ['user', 'patient', 'doctor', 'admin', 'staff'],
      default: 'patient',
    },
    specialty: {
      type: String,
      required: function () {
        return this.role === 'doctor';
      },
    },
    // Removed department field
    isApproved: { type: Boolean, default: false }, // Admin approval for doctors
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
