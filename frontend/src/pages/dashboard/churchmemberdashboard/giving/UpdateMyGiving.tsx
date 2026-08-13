import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { FiX, FiUpload } from "react-icons/fi";
import { updateGiving, type Giving } from "../../../../Features/giving/givingAPI";
import { uploadFileToCloudinary } from "../../../../Features/cloudinary/cloudinaryAPI";
import { type Member } from "../../../../Features/members/membersAPI";
import { type GivingCategory } from "../../../../Features/giving/givingAPI";
import "./UpdateMyGiving.css";

interface UpdateMyGivingProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  giving: Giving;
  members: Member[];
  categories: GivingCategory[];
}

export default function UpdateMyGiving({ isOpen, onClose, onSuccess, giving, members, categories }: UpdateMyGivingProps) {
  const token = useSelector((state: any) => state.user.token);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    memberId: "",
    categoryId: "",
    amount: "",
    currency: "KES",
    date: "",
    paymentMethod: "",
    status: "pending",
    notes: "",
    isAnonymous: false,
    receiptNumber: "",
    receiptFile: "",
    receiptFilePublicId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadingReceipt, setUploadingReceipt] = useState(false);

  useEffect(() => {
    if (giving) {
      setFormData({
        memberId: giving.memberId.toString(),
        categoryId: giving.categoryId?.toString() || "",
        amount: giving.amount,
        currency: giving.currency || "KES",
        date: giving.date.split("T")[0],
        paymentMethod: giving.paymentMethod || "",
        status: giving.status,
        notes: giving.notes || "",
        isAnonymous: giving.isAnonymous,
        receiptNumber: giving.receiptNumber || "",
        receiptFile: giving.receiptFile || "",
        receiptFilePublicId: giving.receiptFilePublicId || "",
      });
    }
  }, [giving]);

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setUploadingReceipt(true);
    try {
      const result = await uploadFileToCloudinary(file, token, "vinechms/giving/receipts", {
        resourceType: "image",
        quality: 80,
      });
      setFormData((prev) => ({
        ...prev,
        receiptFile: result.secureUrl,
        receiptFilePublicId: result.publicId,
      }));
    } catch (err: any) {
      setError(err.message || "Receipt upload failed");
    } finally {
      setUploadingReceipt(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeReceipt = () => {
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
      await updateGiving(giving.givingId, {
        memberId: parseInt(formData.memberId),
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : undefined,
        amount: formData.amount,
        currency: formData.currency,
        date: new Date(formData.date).toISOString(),
        paymentMethod: formData.paymentMethod || undefined,
        status: formData.status,
        notes: formData.notes || undefined,
        isAnonymous: formData.isAnonymous,
        receiptNumber: formData.receiptNumber || undefined,
        receiptFile: formData.receiptFile || undefined,
        receiptFilePublicId: formData.receiptFilePublicId || undefined,
      }, token);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update giving");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const availableMembers = members.filter(m => m.isActive && m.churchId === giving.churchId);
  const availableCategories = categories.filter(c => c.isActive);

  return (
    <div className="member-giving-modal-overlay" onClick={onClose}>
      <div className="member-giving-modal" onClick={(e) => e.stopPropagation()}>
        <div className="member-giving-modal-header">
          <h3>Edit Giving Record</h3>
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
            <div className="member-giving-form-group">
              <label>Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="member-giving-form-row">
            <div className="member-giving-form-group">
              <label>Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              >
                <option value="">Select method</option>
                <option value="cash">Cash</option>
                <option value="bank">Bank Transfer</option>
                <option value="mpesa">M-Pesa</option>
                <option value="card">Card</option>
                <option value="check">Check</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="member-giving-form-group">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>

          <div className="member-giving-form-group">
            <label>Receipt Upload</label>
            <div className="member-giving-file-upload-wrapper">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                disabled={uploadingReceipt}
                className="member-giving-file-input"
                id="update-receipt-upload"
              />
              <label htmlFor="update-receipt-upload" className="member-giving-file-label">
                <FiUpload size={16} />
                {uploadingReceipt ? "Uploading..." : "Upload Receipt"}
              </label>
            </div>
            {formData.receiptFile && (
              <div className="member-giving-file-preview">
                <span>Receipt uploaded</span>
                <button type="button" onClick={removeReceipt} className="member-giving-remove-file">
                  <FiX size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="member-giving-form-row">
            <div className="member-giving-form-group">
              <label>Receipt Number</label>
              <input
                type="text"
                value={formData.receiptNumber}
                onChange={(e) => setFormData({ ...formData, receiptNumber: e.target.value })}
              />
            </div>
          </div>

          <div className="member-giving-form-group">
            <label>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              placeholder="Additional notes"
            />
          </div>

          <div className="member-giving-checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={formData.isAnonymous}
                onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
              />
              Anonymous Donation
            </label>
          </div>

          {error && <div className="member-giving-form-error">{error}</div>}

          <div className="member-giving-modal-actions">
            <button type="button" onClick={onClose} className="member-giving-modal-cancel">
              Cancel
            </button>
            <button type="submit" className="member-giving-modal-submit" disabled={loading || uploadingReceipt}>
              {loading ? "Updating..." : "Update Giving"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}