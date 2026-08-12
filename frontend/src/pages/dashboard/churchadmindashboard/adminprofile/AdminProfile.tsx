import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { FiUpload, FiX, FiUser, FiMaximize2 } from "react-icons/fi";
import { updateUser } from "../../../../Features/userSlice";
import { updateMember, fetchMemberByUserId } from "../../../../Features/members/membersAPI";
import { uploadFileToCloudinary } from "../../../../Features/cloudinary/cloudinaryAPI";
import "./AdminProfile.css";

interface AdminProfileProps {
  user: any;
  token: string;
  userId: number;
  churchId: number;
}

export default function AdminProfile({ user, token, userId }: AdminProfileProps) {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    gender: user?.gender || "",
    dateOfBirth: user?.dateOfBirth?.split("T")[0] || "",
    maritalStatus: user?.maritalStatus || "",
    occupation: user?.occupation || "",
    address: user?.address || "",
    profilePicture: user?.profilePicture || "",
    profilePicturePublicId: user?.profilePicturePublicId || "",
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [memberId, setMemberId] = useState<number | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    const loadMemberId = async () => {
      if (token && userId) {
        try {
          const member = await fetchMemberByUserId(userId, token);
          if (member && member.memberId) {
            setMemberId(member.memberId);
            if (member.profilePicture) {
              setFormData((prev) => ({
                ...prev,
                profilePicture: member.profilePicture,
                profilePicturePublicId: member.profilePicturePublicId || "",
              }));
              if (!user?.profilePicture) {
                dispatch(updateUser({
                  profilePicture: member.profilePicture,
                  profilePicturePublicId: member.profilePicturePublicId || "",
                }));
              }
            }
          }
        } catch (err) {
          console.error("Failed to load member ID:", err);
        }
      }
    };
    loadMemberId();
  }, [token, userId, dispatch, user?.profilePicture]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      if (!memberId) {
        throw new Error("Member ID not loaded. Please refresh.");
      }

      await updateMember(
        memberId,
        {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone || undefined,
          gender: formData.gender || undefined,
          dateOfBirth: formData.dateOfBirth || undefined,
          maritalStatus: formData.maritalStatus || undefined,
          occupation: formData.occupation || undefined,
          address: formData.address || undefined,
          profilePicture: formData.profilePicture || undefined,
          profilePicturePublicId: formData.profilePicturePublicId || undefined,
        },
        token
      );

      dispatch(
        updateUser({
          fullName: formData.fullName,
          phone: formData.phone || undefined,
          gender: formData.gender || undefined,
          dateOfBirth: formData.dateOfBirth || undefined,
          maritalStatus: formData.maritalStatus || undefined,
          occupation: formData.occupation || undefined,
          address: formData.address || undefined,
          profilePicture: formData.profilePicture || undefined,
          profilePicturePublicId: formData.profilePicturePublicId || undefined,
        })
      );

      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const getRoleLabel = (role?: string): string => {
    const labels: Record<string, string> = {
      pastor: "Pastor",
      elder: "Elder",
      treasurer: "Treasurer",
      secretary: "Secretary",
      church_admin: "Church Admin",
      church_member: "Member",
      super_admin: "Super Admin",
      large_org_admin: "Large Organization Admin",
      large_org_member: "Large Organization Member",
      small_org_admin: "Small Organization Admin",
      small_org_member: "Small Organization Member",
    };
    return labels[role || "church_member"] || role || "Member";
  };

  const getRoleBadgeClass = (role?: string): string => {
    return `members-role-badge role-${role || "church_member"}`;
  };

  const getInitials = () => {
    if (formData.fullName) {
      return formData.fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return "U";
  };

  return (
    <div className="admin-profile">
      <div className="admin-profile-header">
        <div className="admin-profile-title-section">
          <h3>Admin Profile</h3>
          <p>Update your personal information</p>
        </div>
      </div>

      <div className="admin-profile-picture-section">
        <div className="admin-profile-avatar-wrapper">
          {formData.profilePicture ? (
            <div 
              className="admin-profile-avatar-image clickable"
              onClick={() => setIsImageModalOpen(true)}
            >
              <img src={formData.profilePicture} alt="Profile" />
              <button
                type="button"
                className="admin-profile-remove-avatar"
                onClick={(e) => {
                  e.stopPropagation();
                  removeProfilePicture();
                }}
                title="Remove photo"
              >
                <FiX size={16} />
              </button>
              <div className="admin-profile-avatar-expand">
                <FiMaximize2 size={16} />
              </div>
            </div>
          ) : (
            <div className="admin-profile-avatar-placeholder">
              <FiUser size={32} />
              <span>{getInitials()}</span>
            </div>
          )}
        </div>
        <div className="admin-profile-upload-actions">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            disabled={uploadingImage}
            className="admin-profile-file-input"
            id="profile-image"
          />
          <label htmlFor="profile-image" className="admin-profile-file-label">
            <FiUpload size={16} />
            {uploadingImage ? "Uploading..." : "Change Photo"}
          </label>
          {formData.profilePicture && (
            <button
              type="button"
              className="admin-profile-remove-btn"
              onClick={removeProfilePicture}
            >
              Remove
            </button>
          )}
        </div>
      </div>

      <div className="admin-profile-role-display">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontWeight: 600, color: "#374151" }}>Current Role:</span>
          <span className={getRoleBadgeClass(user?.role)}>
            {getRoleLabel(user?.role)}
          </span>
        </div>
        {user?.role === "church_member" && (
          <div style={{ marginTop: "0.5rem", padding: "0.5rem", background: "#fef3c7", borderRadius: "6px", fontSize: "0.8rem", color: "#92400e" }}>
            ⚠️ If you have been upgraded to a special role (Pastor, Elder, Treasurer, or Secretary),
            please log out and log back in to see your new role and permissions.
          </div>
        )}
        {user?.role !== "church_member" && user?.role !== "church_admin" && user?.role !== "super_admin" && (
          <div style={{ marginTop: "0.5rem", padding: "0.5rem", background: "#dbeafe", borderRadius: "6px", fontSize: "0.8rem", color: "#1e40af" }}>
            ✅ You have been upgraded to <strong>{getRoleLabel(user?.role)}</strong>.
            You now have additional permissions in the system.
          </div>
        )}
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
          <button type="submit" className="btn-primary" disabled={saving || uploadingImage}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      {isImageModalOpen && (
        <div className="admin-profile-image-modal" onClick={() => setIsImageModalOpen(false)}>
          <div className="admin-profile-image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="admin-profile-image-modal-close" onClick={() => setIsImageModalOpen(false)}>
              <FiX size={24} />
            </button>
            <img src={formData.profilePicture} alt="Profile" />
          </div>
        </div>
      )}
    </div>
  );
}