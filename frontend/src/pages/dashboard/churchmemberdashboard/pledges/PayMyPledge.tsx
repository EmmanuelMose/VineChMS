// File: frontend/src/pages/dashboard/churchmemberdashboard/pledges/PayMyPledge.tsx

import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { FiX, FiSend, FiUpload, FiEye } from "react-icons/fi";
import { updatePledge, type Pledge } from "../../../../Features/pledges/pledgesAPI";
import { createGiving } from "../../../../Features/giving/givingAPI";
import { uploadFileToCloudinary } from "../../../../Features/cloudinary/cloudinaryAPI";
import "./PayMyPledge.css";

interface PayMyPledgeProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  pledge: Pledge;
}

export default function PayMyPledge({ 
  isOpen, 
  onClose, 
  onSuccess, 
  pledge
}: PayMyPledgeProps) {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [mode, setMode] = useState<"mpesa" | "cash">("mpesa");
  const [formData, setFormData] = useState({
    amount: "",
    phoneNumber: "",
    notes: "",
    receiptFile: "",
    receiptFilePublicId: "",
  });
  const [loading, setLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [error, setError] = useState("");
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [evidenceUrl, setEvidenceUrl] = useState("");

  const totalAmount = parseFloat(pledge.amount);
  const paidAmount = parseFloat(pledge.paidAmount || "0");
  const remaining = totalAmount - paidAmount;

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setUploadingFile(true);
    try {
      const result = await uploadFileToCloudinary(file, token, "vinechms/pledges/payments", {
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

  const openEvidenceModal = (url: string) => {
    setEvidenceUrl(url);
    setEvidenceModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const paymentAmount = parseFloat(formData.amount);
      if (isNaN(paymentAmount) || paymentAmount <= 0) {
        alert("Please enter a valid payment amount.");
        setLoading(false);
        return;
      }

      if (paymentAmount > remaining) {
        alert(`Payment amount cannot exceed remaining balance of KES ${remaining.toFixed(2)}`);
        setLoading(false);
        return;
      }

      const givingPayload: any = {
        memberId: pledge.memberId,
        churchId: Number(churchId),
        categoryId: pledge.categoryId || undefined,
        amount: formData.amount,
        currency: "KES",
        type: "pledge",
        date: new Date().toISOString(),
        notes: `Payment towards pledge #${pledge.pledgeId} - ${formData.notes || "No additional notes"}`,
      };

      if (mode === "mpesa") {
        if (!formData.phoneNumber) {
          alert("Please enter a phone number for M-Pesa payment.");
          setLoading(false);
          return;
        }
        givingPayload.paymentMethod = "mpesa";
        givingPayload.status = "pending";
        givingPayload.phoneNumber = formData.phoneNumber;
      } else {
        if (!formData.receiptFile) {
          alert("Please upload evidence (receipt/screenshot) for this payment.");
          setLoading(false);
          return;
        }
        givingPayload.paymentMethod = "cash";
        givingPayload.status = "pending";
        givingPayload.receiptFile = formData.receiptFile;
        givingPayload.receiptFilePublicId = formData.receiptFilePublicId;
      }

      await createGiving(givingPayload, token);

      const newPaidAmount = paidAmount + paymentAmount;
      const isFulfilled = newPaidAmount >= totalAmount;

      await updatePledge(pledge.pledgeId, {
        paidAmount: newPaidAmount.toString(),
        isFulfilled: isFulfilled,
      }, token);

      if (mode === "mpesa") {
        alert("STK Push sent successfully! Please check your phone and enter your M-Pesa PIN to complete the payment. The pledge will be updated automatically.");
      } else {
        alert("Payment recorded successfully! The pledge has been updated. Please wait for admin approval.");
      }

      setFormData({
        amount: "",
        phoneNumber: "",
        notes: "",
        receiptFile: "",
        receiptFilePublicId: "",
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to process payment");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isMpesaMode = mode === "mpesa";

  return (
    <div className="member-pledges-modal-overlay" onClick={onClose}>
      {evidenceModalOpen && (
        <div className="member-pledges-modal-overlay" onClick={() => setEvidenceModalOpen(false)}>
          <div className="member-pledges-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "90vw", padding: "0.5rem" }}>
            <button
              onClick={() => setEvidenceModalOpen(false)}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: "rgba(0,0,0,0.6)",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                cursor: "pointer",
                zIndex: 10,
              }}
            >
              <FiX size={24} />
            </button>
            <img src={evidenceUrl} alt="Evidence" style={{ maxWidth: "100%", maxHeight: "85vh", display: "block", margin: "0 auto" }} />
          </div>
        </div>
      )}

      <div className="member-pledges-modal member-pledges-pay-modal" onClick={(e) => e.stopPropagation()}>
        <div className="member-pledges-modal-header">
          <h3>Pay Pledge</h3>
          <button onClick={onClose} className="member-pledges-modal-close">
            <FiX size={20} />
          </button>
        </div>

        <div className="member-pledges-pay-summary">
          <div className="member-pledges-pay-member">
            <strong>Pledge Amount: KES {totalAmount.toFixed(2)}</strong>
          </div>
          <div className="member-pledges-pay-amounts">
            <div className="member-pledges-pay-amount-item">
              <label>Paid</label>
              <span className="member-pledges-pay-paid">KES {paidAmount.toFixed(2)}</span>
            </div>
            <div className="member-pledges-pay-amount-item">
              <label>Remaining</label>
              <span className="member-pledges-pay-remaining">KES {remaining.toFixed(2)}</span>
            </div>
          </div>
          <div className="member-pledges-pay-progress">
            <div className="member-pledges-pay-progress-bar">
              <div 
                className="member-pledges-pay-progress-fill" 
                style={{ width: `${totalAmount > 0 ? Math.min((paidAmount / totalAmount) * 100, 100) : 0}%` }}
              ></div>
            </div>
            <span className="member-pledges-pay-progress-text">
              {totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0}%
            </span>
          </div>
        </div>

        <div className="member-pledges-pay-mode-selector">
          <button 
            className={`member-pledges-pay-mode-btn ${mode === "mpesa" ? "active" : ""}`}
            onClick={() => setMode("mpesa")}
          >
            <FiSend size={16} /> M-Pesa
          </button>
          <button 
            className={`member-pledges-pay-mode-btn ${mode === "cash" ? "active" : ""}`}
            onClick={() => setMode("cash")}
          >
            <FiUpload size={16} /> Cash with Evidence
          </button>
        </div>

        <form onSubmit={handleSubmit} className="member-pledges-modal-form">
          <div className="member-pledges-form-group">
            <label>Payment Amount (KES) *</label>
            <input
              type="number"
              step="1"
              min="1"
              max={remaining}
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder={`Max: ${remaining.toFixed(2)}`}
              required
            />
            <small style={{ color: "#6b7280", fontSize: "0.75rem" }}>
              Maximum amount you can pay is KES {remaining.toFixed(2)}
            </small>
          </div>

          {isMpesaMode && (
            <div className="member-pledges-form-group">
              <label>Phone Number (M-Pesa) *</label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="e.g., 0712345678"
                required
              />
              <small style={{ color: "#6b7280", fontSize: "0.75rem" }}>
                STK push will be sent to this number. Enter starting with 0.
              </small>
            </div>
          )}

          {!isMpesaMode && (
            <div className="member-pledges-form-group">
              <label>Upload Evidence (Receipt/Screenshot) *</label>
              <div className="member-pledges-file-upload-wrapper">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  disabled={uploadingFile}
                  className="member-pledges-file-input"
                  id="member-pledge-payment-upload"
                />
                <label htmlFor="member-pledge-payment-upload" className="member-pledges-file-label">
                  <FiUpload size={16} />
                  {uploadingFile ? "Uploading..." : "Upload Evidence"}
                </label>
              </div>
              {formData.receiptFile && (
                <div className="member-pledges-file-preview">
                  <span>Evidence uploaded</span>
                  <button 
                    type="button" 
                    onClick={() => openEvidenceModal(formData.receiptFile)}
                    className="member-pledges-view-evidence"
                  >
                    <FiEye size={16} /> View
                  </button>
                  <button type="button" onClick={removeFile} className="member-pledges-remove-file">
                    <FiX size={16} />
                  </button>
                </div>
              )}
              <small style={{ color: "#6b7280", fontSize: "0.75rem" }}>
                Upload a screenshot or photo of the payment receipt. Admin will review and approve.
              </small>
            </div>
          )}

          <div className="member-pledges-form-group">
            <label>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              placeholder="Additional notes about this payment..."
            />
          </div>

          {error && <div className="member-pledges-form-error">{error}</div>}

          <div className="member-pledges-modal-actions">
            <button type="button" className="member-pledges-modal-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="member-pledges-modal-submit"
              disabled={
                loading ||
                uploadingFile ||
                !formData.amount ||
                (isMpesaMode && !formData.phoneNumber) ||
                (!isMpesaMode && !formData.receiptFile)
              }
            >
              {loading ? "Processing..." : isMpesaMode ? <><FiSend size={16} /> Send STK Push</> : "Submit Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}