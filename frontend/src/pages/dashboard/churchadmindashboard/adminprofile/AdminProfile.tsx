import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateUser } from "../../../../Features/userSlice";
import "./AdminProfile.css";

interface AdminProfileProps {
  user: any;
}

export default function AdminProfile({ user }: AdminProfileProps) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    gender: user?.gender || "",
    dateOfBirth: user?.dateOfBirth?.split("T")[0] || "",
    maritalStatus: user?.maritalStatus || "",
    occupation: user?.occupation || "",
    address: user?.address || "",
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      dispatch(updateUser(formData));
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-profile">
      <div className="admin-profile-header">
        <div className="admin-profile-title-section">
          <h3>Admin Profile</h3>
          <p>Update your personal information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="admin-profile-form">
        {success && <div className="admin-profile-success">{success}</div>}
        {error && <div className="admin-profile-error-msg">{error}</div>}

        <div className="admin-profile-row">
          <div className="admin-profile-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="admin-profile-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="admin-profile-disabled"
            />
          </div>
        </div>

        <div className="admin-profile-row">
          <div className="admin-profile-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 234 567 890"
            />
          </div>
          <div className="admin-profile-group">
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="admin-profile-row">
          <div className="admin-profile-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </div>
          <div className="admin-profile-group">
            <label>Marital Status</label>
            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
            >
              <option value="">Select status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          </div>
        </div>

        <div className="admin-profile-group">
          <label>Occupation</label>
          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            placeholder="Your occupation"
          />
        </div>

        <div className="admin-profile-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Your address"
          />
        </div>

        <div className="admin-profile-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}