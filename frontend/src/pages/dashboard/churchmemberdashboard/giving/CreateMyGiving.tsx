// File: src/pages/dashboard/churchmemberdashboard/giving/CreateMyGiving.tsx

import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { FiX, FiSend, FiUpload } from "react-icons/fi";
import { createGiving } from "../../../../Features/giving/givingAPI";
import { uploadFileToCloudinary } from "../../../../Features/cloudinary/cloudinaryAPI";
import { type Member } from "../../../../Features/members/membersAPI";
import { type GivingCategory } from "../../../../Features/giving/givingAPI";
import { hasPermission, type UserRole } from "../../../../utils/permissions";
import "./CreateMyGiving.css";

interface CreateMyGivingProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  churchId?: number;
  members: Member[];
  categories: GivingCategory[];
  mode?: "mpesa" | "cash";
  currentMemberId?: number;
  userRole?: UserRole;
}

export default function CreateMyGiving({
  isOpen,
  onClose,
  onSuccess,
  churchId,
  members,
  categories,
  mode = "mpesa",
  currentMemberId,
  userRole,
}: CreateMyGivingProps) {
  const token = useSelector((state: any) => state.user.token);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    memberId: "",
    categoryId: "",
    amount: "",
    currency: "KES",
    paymentMethod: mode === "mpesa" ? "mpesa" : "cash",
    notes: "",
    isAnonymous: false,
    phoneNumber: "",
    receiptFile: "",
    receiptFilePublicId: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);

  const selectedMember = members.find((m) => m.memberId === parseInt(formData.memberId));

  const canUseMpesa = userRole ? hasPermission(userRole, "create_giving_mpesa") : false;
  const canCreateForOthers = userRole ? hasPermission(userRole, "create_giving_for_others") : false;
  const canUseCash = userRole ? hasPermission(userRole, "create_giving_cash") : false;
  const canCreateOwn = userRole ? hasPermission(userRole, "create_own_giving") : false;

  useEffect(() => {
    if (currentMemberId) {
      setFormData((prev) => ({ ...prev, memberId: currentMemberId.toString() }));
    }
  }, [currentMemberId]);

  useEffect(() => {
    if (selectedMember && selectedMember.phone && mode === "mpesa") {
      setFormData((prev) => ({ ...prev, phoneNumber: selectedMember.phone || "" }));
    }
  }, [formData.memberId, selectedMember, mode]);

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setUploadingFile(true);
    try {
      const result = await uploadFileToCloudinary(file, token, "vinechms/giving/evidence", {
        resourceType: "image",
        quality: 80,
      });
      setFormData((prev) => ({
        ...prev,
        receiptFile: result.secureUrl,
        receiptFilePublicId: result.publicId,
      }));
    } catch (err: any) {
      setError(err.message || "File upload failed");
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeFile = () => {
    setFormData((prev) => ({
      ...prev,
      receiptFile: "",
      receiptFilePublicId: "",
    }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload: any = {
        memberId: parseInt(formData.memberId),
        churchId: Number(churchId),
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : undefined,
        amount: formData.amount,
        currency: formData.currency,
        type: categories.find((c) => c.categoryId === parseInt(formData.categoryId))?.type || "offering",
        date: new Date().toISOString(),
        paymentMethod: mode === "mpesa" ? "mpesa" : "cash",
        notes: formData.notes || undefined,
        isAnonymous: formData.isAnonymous,
      };

      if (mode === "mpesa") {
        payload.phoneNumber = formData.phoneNumber;
        payload.status = "pending";
      } else {
        if (!formData.receiptFile) {
          alert("Please upload evidence (receipt/screenshot) for this payment.");
          setLoading(false);
          return;
        }
        payload.receiptFile = formData.receiptFile;
        payload.receiptFilePublicId = formData.receiptFilePublicId;
        payload.status = "pending";
      }

      await createGiving(payload, token);

      setFormData({
        memberId: currentMemberId ? currentMemberId.toString() : "",
        categoryId: "",
        amount: "",
        currency: "KES",
        paymentMethod: mode === "mpesa" ? "mpesa" : "cash",
        notes: "",
        isAnonymous: false,
        phoneNumber: "",
        receiptFile: "",
        receiptFilePublicId: "",
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to record giving");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const availableMembers = canCreateForOthers
    ? members.filter((m) => m.isActive && m.churchId === churchId)
    : members.filter((m) => m.isActive && m.churchId === churchId && m.memberId === currentMemberId);

  const availableCategories = categories.filter((c) => c.isActive);
  const isMpesaMode = mode === "mpesa";

  if (!canCreateOwn && !canCreateForOthers) return null;
  if (isMpesaMode && !canUseMpesa) return null;
  if (!isMpesaMode && !canUseCash) return null;

  return (
    <div className="member-giving-modal-overlay" onClick={onClose}>
      <div className="member-giving-modal" onClick={(e) => e.stopPropagation()}>
        <div className="member-giving-modal-header">
          <h3>{isMpesaMode ? "Send M-Pesa STK Push" : "Upload Evidence"}</h3>
          <button onClick={onClose} className="member-giving-modal-close">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="member-giving-modal-form">
          <div className="member-giving-form-group">
            <label>Member *</label>
            <select
              value={formData.memberId}
              onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
              required
              disabled={!canCreateForOthers}
            >
              <option value="">Select a member</option>
              {availableMembers.map((member) => (
                <option key={member.memberId} value={member.memberId}>
                  {member.fullName} ({member.email})
                </option>
              ))}
            </select>
          </div>

          <div className="member-giving-form-row">
            <div className="member-giving-form-group">
              <label>Category *</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                required
              >
                <option value="">Select category</option>
                {availableCategories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="member-giving-form-group">
              <label>Amount *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="member-giving-form-row">
            <div className="member-giving-form-group">
              <label>Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              >
                <option value="KES">KES (Kenyan Shilling)</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          {isMpesaMode && (
            <div className="member-giving-form-group">
              <label>Phone Number (M-Pesa) *</label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="e.g., 0712345678"
                required
              />
              <small style={{ color: "#6b7280", fontSize: "0.75rem" }}>
                STK push will be sent to this number. Auto-fills from member profile.
              </small>
            </div>
          )}

          {!isMpesaMode && (
            <div className="member-giving-form-group">
              <label>Upload Evidence (Receipt/Screenshot) *</label>
              <div className="member-giving-file-upload-wrapper">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  disabled={uploadingFile}
                  className="member-giving-file-input"
                  id="evidence-upload"
                />
                <label htmlFor="evidence-upload" className="member-giving-file-label">
                  <FiUpload size={16} />
                  {uploadingFile ? "Uploading..." : "Upload Evidence"}
                </label>
              </div>
              {formData.receiptFile && (
                <div className="member-giving-file-preview">
                  <span>Evidence uploaded</span>
                  <button type="button" onClick={removeFile} className="member-giving-remove-file">
                    <FiX size={16} />
                  </button>
                </div>
              )}
              <small style={{ color: "#6b7280", fontSize: "0.75rem" }}>
                Upload a screenshot or photo of your payment receipt.
              </small>
            </div>
          )}

          <div className="member-giving-form-group">
            <label>Status</label>
            <input
              type="text"
              value="Pending"
              disabled
              className="member-giving-status-disabled"
            />
          </div>

          <div className="member-giving-form-group">
            <label>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              placeholder="Additional notes..."
            />
          </div>

          <div className="member-giving-checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={formData.isAnonymous}
                onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
              />
              Hide my name (Anonymous)
            </label>
          </div>

          {error && <div className="member-giving-form-error">{error}</div>}

          <div className="member-giving-modal-actions">
            <button type="button" onClick={onClose} className="member-giving-modal-cancel">
              Cancel
            </button>
            <button
              type="submit"
              className="member-giving-modal-submit"
              disabled={
                loading ||
                uploadingFile ||
                (isMpesaMode && (!formData.phoneNumber || !formData.amount)) ||
                (!isMpesaMode && !formData.receiptFile)
              }
            >
              {loading ? "Saving..." : isMpesaMode ? <><FiSend size={16} /> Send STK Push</> : "Submit for Approval"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}