import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchChurchById, updateChurch, type Church } from "../../../../Features/churches/churchesAPI";
import "./ChurchProfile.css";

interface ChurchProfileProps {
  churchId?: number;
}

export default function ChurchProfile({ churchId }: ChurchProfileProps) {
  const token = useSelector((state: any) => state.user.token);
  const [church, setChurch] = useState<Church | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    denomination: "",
  });

  useEffect(() => {
    if (churchId) {
      loadChurch();
    }
  }, [churchId]);

  const loadChurch = async () => {
    try {
      setLoading(true);
      const data = await fetchChurchById(churchId!, token);
      setChurch(data);
      setFormData({
        name: data.name || "",
        description: data.description || "",
        email: data.email || "",
        phone: data.phone || "",
        website: data.website || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        country: data.country || "",
        postalCode: data.postalCode || "",
        denomination: data.denomination || "",
      });
    } catch (error) {
      console.error("Failed to load church:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await updateChurch(churchId!, formData, token);
      setSuccess("Church profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError("Failed to update church profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="church-profile-loading">Loading church profile...</div>;
  }

  if (!church) {
    return <div className="church-profile-error">Church not found</div>;
  }

  return (
    <div className="church-profile">
      <div className="church-profile-header">
        <div className="church-profile-title-section">
          <h3>Church Profile</h3>
          <p>Update your church information and details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="church-profile-form">
        {success && <div className="church-profile-success">{success}</div>}
        {error && <div className="church-profile-error-msg">{error}</div>}

        <div className="church-profile-row">
          <div className="church-profile-group">
            <label>Church Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter church name"
              required
            />
          </div>
          <div className="church-profile-group">
            <label>Denomination</label>
            <input
              type="text"
              name="denomination"
              value={formData.denomination}
              onChange={handleChange}
              placeholder="e.g., Pentecostal"
            />
          </div>
        </div>

        <div className="church-profile-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter church description"
            rows={3}
          />
        </div>

        <div className="church-profile-row">
          <div className="church-profile-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="church@email.com"
              required
            />
          </div>
          <div className="church-profile-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 234 567 890"
            />
          </div>
        </div>

        <div className="church-profile-group">
          <label>Website</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://www.church.com"
          />
        </div>

        <div className="church-profile-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Street address"
          />
        </div>

        <div className="church-profile-row">
          <div className="church-profile-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
            />
          </div>
          <div className="church-profile-group">
            <label>State/Province</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
            />
          </div>
        </div>

        <div className="church-profile-row">
          <div className="church-profile-group">
            <label>Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country"
            />
          </div>
          <div className="church-profile-group">
            <label>Postal Code</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="Postal code"
            />
          </div>
        </div>

        <div className="church-profile-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}