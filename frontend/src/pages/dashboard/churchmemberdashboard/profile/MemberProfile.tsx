import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMemberByUserId, updateMember, type Member } from "../../../../Features/members/membersAPI";
import { fetchChurchById, type Church } from "../../../../Features/churches/churchesAPI";
import { updateUser } from "../../../../Features/userSlice";
import { uploadFileToCloudinary } from "../../../../Features/cloudinary/cloudinaryAPI";
import { FiUser, FiGlobe, FiEdit2, FiSave, FiX, FiMaximize2, FiUpload } from "react-icons/fi";
import "./MemberProfile.css";

export default function MemberProfile() {
  const token = useSelector((state: any) => state.user.token);
  const userId = useSelector((state: any) => state.user.user?.userId);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [member, setMember] = useState<Member | null>(null);
  const [church, setChurch] = useState<Church | null>(null);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    maritalStatus: "",
    occupation: "",
    address: "",
    profilePicture: "",
    profilePicturePublicId: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!token || !userId || !churchId) return;
      try {
        setLoading(true);
        const [memberData, churchData] = await Promise.all([
          fetchMemberByUserId(userId, token),
          fetchChurchById(churchId, token),
        ]);
        setMember(memberData);
        setChurch(churchData);
        setFormData({
          fullName: memberData.fullName || "",
          email: memberData.email || "",
          phone: memberData.phone || "",
          gender: memberData.gender || "",
          dateOfBirth: memberData.dateOfBirth ? memberData.dateOfBirth.split("T")[0] : "",
          maritalStatus: memberData.maritalStatus || "",
          occupation: memberData.occupation || "",
          address: memberData.address || "",
          profilePicture: memberData.profilePicture || "",
          profilePicturePublicId: memberData.profilePicturePublicId || "",
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [token, userId, churchId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setUploadingImage(true);
    try {
      const result = await uploadFileToCloudinary(file, token, "vinechms/profiles", {
        resourceType: "image",
        quality: 80,
        width: 400,
        height: 400,
        crop: "limit",
      });
      setFormData((prev) => ({
        ...prev,
        profilePicture: result.secureUrl,
        profilePicturePublicId: result.publicId,
      }));
    } catch (err: any) {
      setError(err.message || "Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const removeProfilePicture = () => {
    setFormData((prev) => ({
      ...prev,
      profilePicture: "",
      profilePicturePublicId: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const updateData: any = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || undefined,
        gender: formData.gender || undefined,
        maritalStatus: formData.maritalStatus || undefined,
        occupation: formData.occupation || undefined,
        address: formData.address || undefined,
        profilePicture: formData.profilePicture || undefined,
        profilePicturePublicId: formData.profilePicturePublicId || undefined,
      };

      if (formData.dateOfBirth) {
        updateData.dateOfBirth = formData.dateOfBirth;
      }

      const updatedMember = await updateMember(member!.memberId, updateData, token);

      dispatch(updateUser({
        fullName: formData.fullName,
        phone: formData.phone || undefined,
        gender: formData.gender || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        maritalStatus: formData.maritalStatus || undefined,
        occupation: formData.occupation || undefined,
        address: formData.address || undefined,
        profilePicture: formData.profilePicture || undefined,
        profilePicturePublicId: formData.profilePicturePublicId || undefined,
      }));

      setMember(updatedMember);
      setSuccess("Profile updated successfully!");
      setEditMode(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Update error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    if (member) {
      setFormData({
        fullName: member.fullName || "",
        email: member.email || "",
        phone: member.phone || "",
        gender: member.gender || "",
        dateOfBirth: member.dateOfBirth ? member.dateOfBirth.split("T")[0] : "",
        maritalStatus: member.maritalStatus || "",
        occupation: member.occupation || "",
        address: member.address || "",
        profilePicture: member.profilePicture || "",
        profilePicturePublicId: member.profilePicturePublicId || "",
      });
    }
  };

  if (loading) {
    return <div className="member-profile-loading">Loading profile...</div>;
  }

  return (
    <div className="member-profile-page">
      <div className="member-profile-header">
        <div>
          <h2 className="member-profile-title">My Profile</h2>
          <p className="member-profile-subtitle">View and manage your personal information</p>
        </div>
        {!editMode && (
          <button className="member-profile-edit-btn" onClick={() => setEditMode(true)}>
            <FiEdit2 size={16} />
            Edit Profile
          </button>
        )}
      </div>

      {success && <div className="member-profile-success">{success}</div>}
      {error && <div className="member-profile-error">{error}</div>}

      <div className="member-profile-grid">
        <div className="member-profile-card personal-info">
          <h3 className="member-profile-card-title">
            <FiUser size={18} />
            Personal Information
          </h3>

          {editMode && (
            <div className="member-profile-picture-section">
              <div className="member-profile-avatar-wrapper">
                {formData.profilePicture ? (
                  <div
                    className="member-profile-avatar-image clickable"
                    onClick={() => setIsLogoModalOpen(true)}
                  >
                    <img src={formData.profilePicture} alt="Profile" />
                    <button
                      type="button"
                      className="member-profile-remove-avatar"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeProfilePicture();
                      }}
                      title="Remove photo"
                    >
                      <FiX size={16} />
                    </button>
                    <div className="member-profile-avatar-expand">
                      <FiMaximize2 size={16} />
                    </div>
                  </div>
                ) : (
                  <div className="member-profile-avatar-placeholder">
                    <FiUser size={32} />
                    <span>{formData.fullName ? formData.fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "U"}</span>
                  </div>
                )}
              </div>
              <div className="member-profile-upload-actions">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  disabled={uploadingImage}
                  className="member-profile-file-input"
                  id="profile-image"
                />
                <label htmlFor="profile-image" className="member-profile-file-label">
                  <FiUpload size={16} />
                  {uploadingImage ? "Uploading..." : "Change Photo"}
                </label>
                {formData.profilePicture && (
                  <button
                    type="button"
                    className="member-profile-remove-btn"
                    onClick={removeProfilePicture}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          )}

          {!editMode && formData.profilePicture && (
            <div className="member-profile-picture-display">
              <div
                className="member-profile-avatar-image clickable"
                onClick={() => setIsLogoModalOpen(true)}
                style={{ width: "80px", height: "80px", marginBottom: "1rem" }}
              >
                <img src={formData.profilePicture} alt="Profile" />
                <div className="member-profile-avatar-expand">
                  <FiMaximize2 size={16} />
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="member-profile-form">
            <div className="member-profile-row">
              <div className="member-profile-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={!editMode ? "member-profile-disabled" : ""}
                  required
                />
              </div>
              <div className="member-profile-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="member-profile-disabled"
                />
              </div>
            </div>

            <div className="member-profile-row">
              <div className="member-profile-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={!editMode ? "member-profile-disabled" : ""}
                  placeholder="+1 234 567 890"
                />
              </div>
              <div className="member-profile-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={!editMode ? "member-profile-disabled" : ""}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="member-profile-row">
              <div className="member-profile-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={!editMode ? "member-profile-disabled" : ""}
                />
              </div>
              <div className="member-profile-group">
                <label>Marital Status</label>
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={!editMode ? "member-profile-disabled" : ""}
                >
                  <option value="">Select status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>
            </div>

            <div className="member-profile-group">
              <label>Occupation</label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                disabled={!editMode}
                className={!editMode ? "member-profile-disabled" : ""}
                placeholder="Your occupation"
              />
            </div>

            <div className="member-profile-group">
              <label>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!editMode}
                className={!editMode ? "member-profile-disabled" : ""}
                rows={2}
                placeholder="Your address"
              />
            </div>

            {editMode && (
              <div className="member-profile-actions">
                <button type="button" className="member-profile-cancel-btn" onClick={handleCancel}>
                  <FiX size={16} />
                  Cancel
                </button>
                <button type="submit" className="member-profile-save-btn" disabled={saving || uploadingImage}>
                  <FiSave size={16} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </form>
        </div>

        <div className="member-profile-card church-info">
          <h3 className="member-profile-card-title">
            <FiGlobe size={18} />
            Church Information
          </h3>
          {church ? (
            <div className="member-profile-church-details">
              {church.logo && (
                <div className="member-profile-church-logo-wrapper">
                  <div
                    className="member-profile-church-logo"
                    onClick={() => setIsLogoModalOpen(true)}
                  >
                    <img src={church.logo} alt={`${church.name} logo`} />
                    <div className="member-profile-church-logo-expand">
                      <FiMaximize2 size={16} />
                    </div>
                  </div>
                </div>
              )}
              <div className="member-profile-church-item">
                <strong>Church Name</strong>
                <span>{church.name || "N/A"}</span>
              </div>
              {church.description && (
                <div className="member-profile-church-item">
                  <strong>Description</strong>
                  <span>{church.description}</span>
                </div>
              )}
              <div className="member-profile-church-item">
                <strong>Email</strong>
                <span>{church.email || "N/A"}</span>
              </div>
              <div className="member-profile-church-item">
                <strong>Phone</strong>
                <span>{church.phone || "N/A"}</span>
              </div>
              <div className="member-profile-church-item">
                <strong>Address</strong>
                <span>{church.address || "N/A"}</span>
              </div>
              <div className="member-profile-church-item">
                <strong>City</strong>
                <span>{church.city || "N/A"}</span>
              </div>
              <div className="member-profile-church-item">
                <strong>State</strong>
                <span>{church.state || "N/A"}</span>
              </div>
              <div className="member-profile-church-item">
                <strong>Country</strong>
                <span>{church.country || "N/A"}</span>
              </div>
              <div className="member-profile-church-item">
                <strong>Postal Code</strong>
                <span>{church.postalCode || "N/A"}</span>
              </div>
              {church.denomination && (
                <div className="member-profile-church-item">
                  <strong>Denomination</strong>
                  <span>{church.denomination}</span>
                </div>
              )}
              <div className="member-profile-church-item">
                <strong>Member Since</strong>
                <span>{member?.membershipDate ? new Date(member.membershipDate).toLocaleDateString() : "N/A"}</span>
              </div>
              <div className="member-profile-church-item">
                <strong>Membership Number</strong>
                <span>{member?.membershipNumber || "N/A"}</span>
              </div>
            </div>
          ) : (
            <p className="member-profile-no-data">Church information not available</p>
          )}
        </div>
      </div>

      {isLogoModalOpen && (
        <div className="member-profile-logo-modal" onClick={() => setIsLogoModalOpen(false)}>
          <div className="member-profile-logo-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="member-profile-logo-modal-close" onClick={() => setIsLogoModalOpen(false)}>
              <FiX size={24} />
            </button>
            {formData.profilePicture ? (
              <img src={formData.profilePicture} alt="Profile" />
            ) : (
              church?.logo && <img src={church.logo} alt={`${church.name} logo`} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}