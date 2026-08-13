// File: frontend/src/pages/dashboard/churchmemberdashboard/expenses/CreateMemberExpense.tsx

import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiX, FiSend, FiUpload } from "react-icons/fi";
import { createExpense } from "../../../../Features/expenses/expensesAPI";
import { type ExpenseCategory } from "../../../../Features/expenses/expensesAPI";
import { uploadFileToCloudinary } from "../../../../Features/cloudinary/cloudinaryAPI";
import { type Member } from "../../../../Features/members/membersAPI";
import { hasPermission, type UserRole } from "../../../../utils/permissions";
import "./CreateMemberExpense.css";

interface CreateMemberExpenseProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categories: ExpenseCategory[];
  members: Member[];
  mode?: "mpesa" | "cash";
  currentMemberId?: number;
  userRole?: UserRole;
}

export default function CreateMemberExpense({ 
  isOpen, 
  onClose, 
  onSuccess, 
  categories,
  members,
  mode = "mpesa",
  currentMemberId,
  userRole
}: CreateMemberExpenseProps) {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    memberId: "",
    description: "",
    categoryId: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    phoneNumber: "",
    receiptFile: "",
    receiptFilePublicId: "",
  });
  const [loading, setLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [error, setError] = useState("");

  const selectedMember = members.find((m) => m.memberId === parseInt(formData.memberId));

  const canUseMpesa = userRole ? hasPermission(userRole, "create_giving_mpesa") : false;
  const canUseCash = userRole ? hasPermission(userRole, "create_giving_cash") : false;
  const canCreateForOthers = userRole ? hasPermission(userRole, "create_giving_for_others") : false;

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
      const result = await uploadFileToCloudinary(file, token, "vinechms/expenses/receipts", {
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
        churchId: Number(churchId),
        memberId: parseInt(formData.memberId),
        description: formData.description,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : undefined,
        amount: formData.amount,
        currency: "KES",
        date: new Date(formData.date).toISOString(),
        notes: formData.notes || undefined,
      };

      if (mode === "mpesa") {
        if (!formData.phoneNumber) {
          alert("Please enter a phone number for M-Pesa payment.");
          setLoading(false);
          return;
        }
        payload.paymentMethod = "mpesa";
        payload.status = "pending";
        payload.phoneNumber = formData.phoneNumber;
      } else {
        if (!formData.receiptFile) {
          alert("Please upload evidence (receipt/screenshot) for this payment.");
          setLoading(false);
          return;
        }
        payload.paymentMethod = "cash";
        payload.status = "pending";
        payload.receiptUrl = formData.receiptFile;
        payload.receiptPublicId = formData.receiptFilePublicId;
      }

      const result = await createExpense(payload, token);
      
      if (mode === "mpesa" && result.mpesaCheckoutRequestID) {
        alert("STK Push sent successfully! Please check your phone and enter your M-Pesa PIN to complete the payment.");
      }

      setFormData({
        memberId: currentMemberId ? currentMemberId.toString() : "",
        description: "",
        categoryId: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        notes: "",
        phoneNumber: "",
        receiptFile: "",
        receiptFilePublicId: "",
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create expense");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const availableCategories = categories.filter(c => c.isActive);
  const availableMembers = canCreateForOthers
    ? members.filter((m) => m.isActive && m.churchId === churchId)
    : members.filter((m) => m.isActive && m.churchId === churchId && m.memberId === currentMemberId);

  const isMpesaMode = mode === "mpesa";

  if (isMpesaMode && !canUseMpesa) return null;
  if (!isMpesaMode && !canUseCash) return null;

  return (
    <div className="member-expense-modal-overlay" onClick={onClose}>
      <div className="member-expense-modal" onClick={(e) => e.stopPropagation()}>
        <div className="member-expense-modal-header">
          <h3>{isMpesaMode ? "Pay via M-Pesa" : "Cash Payment with Evidence"}</h3>
          <button onClick={onClose} className="member-expense-modal-close">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="member-expense-modal-form">
          <div className="member-expense-form-group">
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

          <div className="member-expense-form-group">
            <label>Description *</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter expense description"
              required
            />
          </div>

          <div className="member-expense-form-row">
            <div className="member-expense-form-group">
              <label>Category</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                <option value="">Select category</option>
                {availableCategories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="member-expense-form-group">
              <label>Amount (KES) *</label>
              <input
                type="number"
                step="1"
                min="1"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="member-expense-form-row">
            <div className="member-expense-form-group">
              <label>Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>

          {isMpesaMode && (
            <div className="member-expense-form-group">
              <label>Phone Number (M-Pesa) *</label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="e.g., 0712345678"
                required
              />
              <small style={{ color: "#6b7280", fontSize: "0.75rem" }}>
                Enter phone number starting with 0 (e.g., 0712345678). STK push will be sent to this number.
              </small>
            </div>
          )}

          {!isMpesaMode && (
            <div className="member-expense-form-group">
              <label>Upload Evidence (Receipt/Screenshot) *</label>
              <div className="member-expense-file-upload-wrapper">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  disabled={uploadingFile}
                  className="member-expense-file-input"
                  id="evidence-upload"
                />
                <label htmlFor="evidence-upload" className="member-expense-file-label">
                  <FiUpload size={16} />
                  {uploadingFile ? "Uploading..." : "Upload Evidence"}
                </label>
              </div>
              {formData.receiptFile && (
                <div className="member-expense-file-preview">
                  <span>Evidence uploaded</span>
                  <button type="button" onClick={removeFile} className="member-expense-remove-file">
                    <FiX size={16} />
                  </button>
                </div>
              )}
              <small style={{ color: "#6b7280", fontSize: "0.75rem" }}>
                Upload a screenshot or photo of the payment receipt.
              </small>
            </div>
          )}

          <div className="member-expense-form-group">
            <label>Status</label>
            <input
              type="text"
              value="Pending"
              disabled
              className="member-expense-status-disabled"
            />
          </div>

          <div className="member-expense-form-group">
            <label>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              placeholder="Additional notes..."
            />
          </div>

          {error && <div className="member-expense-form-error">{error}</div>}

          <div className="member-expense-modal-actions">
            <button type="button" onClick={onClose} className="member-expense-modal-cancel">
              Cancel
            </button>
            <button
              type="submit"
              className="member-expense-modal-submit"
              disabled={
                loading ||
                uploadingFile ||
                (isMpesaMode && !formData.phoneNumber) ||
                (!isMpesaMode && !formData.receiptFile)
              }
            >
              {loading ? "Processing..." : isMpesaMode ? <><FiSend size={16} /> Send STK Push</> : "Submit for Approval"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}