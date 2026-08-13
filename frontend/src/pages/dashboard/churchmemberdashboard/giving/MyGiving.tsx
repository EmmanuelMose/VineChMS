import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { FiX, FiUpload, FiSend } from "react-icons/fi";
import { fetchGivingByMember, fetchGivingCategories, createGiving, updateGiving, deleteGiving, type Giving, type GivingCategory } from "../../../../Features/giving/givingAPI";
import { fetchMemberByUserId } from "../../../../Features/members/membersAPI";
import { uploadFileToCloudinary } from "../../../../Features/cloudinary/cloudinaryAPI";
import "./MyGiving.css";

export default function MyGiving() {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  const userId = useSelector((state: any) => state.user.user?.userId);

  const [giving, setGiving] = useState<Giving[]>([]);
  const [categories, setCategories] = useState<GivingCategory[]>([]);
  const [memberId, setMemberId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredGiving, setFilteredGiving] = useState<Giving[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Giving | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    categoryId: "",
    amount: "",
    type: "offering",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "",
    notes: "",
    isAnonymous: false,
    receiptNumber: "",
    receiptFile: "",
    receiptFilePublicId: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const loadMemberId = async () => {
      if (token && userId) {
        try {
          const member = await fetchMemberByUserId(userId, token);
          if (member && member.memberId) {
            setMemberId(member.memberId);
            if (member.phone) {
              setFormData(prev => ({ ...prev, phoneNumber: member.phone || "" }));
            }
          }
        } catch (error) {
          console.error("Failed to load member ID:", error);
        }
      }
    };
    loadMemberId();
  }, [token, userId]);

  useEffect(() => {
    if (memberId) {
      loadData();
    }
  }, [memberId]);

  useEffect(() => {
    filterGiving();
  }, [giving, searchTerm, filterCategory, filterType, filterStatus, startDate, endDate]);

  const loadData = async () => {
    if (!memberId || !token) return;
    try {
      setLoading(true);
      const [givingData, categoriesData] = await Promise.all([
        fetchGivingByMember(memberId, token),
        fetchGivingCategories(token),
      ]);
      const churchCategories = categoriesData.filter((c) => c.churchId === churchId);
      setGiving(givingData);
      setCategories(churchCategories);
    } catch (error) {
      console.error("Failed to load giving:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterGiving = () => {
    let filtered = [...giving];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (g) =>
          (g.notes || "").toLowerCase().includes(term) ||
          (g.categoryName || "").toLowerCase().includes(term) ||
          (g.receiptNumber || "").toLowerCase().includes(term)
      );
    }
    if (filterCategory !== "all") {
      filtered = filtered.filter((g) => g.categoryId === parseInt(filterCategory));
    }
    if (filterType !== "all") {
      filtered = filtered.filter((g) => g.type === filterType);
    }
    if (filterStatus !== "all") {
      filtered = filtered.filter((g) => g.status === filterStatus);
    }
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter((g) => new Date(g.date) >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((g) => new Date(g.date) <= end);
    }
    setFilteredGiving(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCategory("all");
    setFilterType("all");
    setFilterStatus("all");
    setStartDate("");
    setEndDate("");
  };

  const getCategoryName = (categoryId?: number) => {
    if (!categoryId) return "Uncategorized";
    const cat = categories.find((c) => c.categoryId === categoryId);
    return cat ? cat.name : "Unknown";
  };

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return "KES 0.00";
    return `KES ${num.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setUploadingFile(true);
    try {
      const result = await uploadFileToCloudinary(file, token, "vinechms/giving/evidence", {
        resourceType: "auto",
        quality: 80,
      });
      setFormData((prev) => ({
        ...prev,
        receiptFile: result.secureUrl,
        receiptFilePublicId: result.publicId,
      }));
    } catch (err: any) {
      alert(err.message || "File upload failed");
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

  const handleEdit = (record: Giving) => {
    setEditingRecord(record);
    const date = new Date(record.date);
    setFormData({
      categoryId: record.categoryId?.toString() || "",
      amount: record.amount,
      type: record.type,
      date: date.toISOString().split("T")[0],
      paymentMethod: record.paymentMethod || "",
      notes: record.notes || "",
      isAnonymous: record.isAnonymous,
      receiptNumber: record.receiptNumber || "",
      receiptFile: record.receiptFile || "",
      receiptFilePublicId: record.receiptFilePublicId || "",
      phoneNumber: "",
    });
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingRecord(null);
    setFormData({
      categoryId: "",
      amount: "",
      type: "offering",
      date: new Date().toISOString().split("T")[0],
      paymentMethod: "",
      notes: "",
      isAnonymous: false,
      receiptNumber: "",
      receiptFile: "",
      receiptFilePublicId: "",
      phoneNumber: "",
    });
    if (userId) {
      fetchMemberByUserId(userId, token).then(member => {
        if (member && member.phone) {
          setFormData(prev => ({ ...prev, phoneNumber: member.phone || "" }));
        }
      }).catch(console.error);
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId) return;
    setSubmitting(true);
    try {
      const payload: any = {
        memberId: memberId,
        churchId: churchId!,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : undefined,
        amount: formData.amount,
        type: formData.type,
        date: new Date(formData.date).toISOString(),
        paymentMethod: formData.paymentMethod,
        notes: formData.notes || undefined,
        isAnonymous: formData.isAnonymous,
      };

      if (formData.paymentMethod === "mpesa") {
        payload.phoneNumber = formData.phoneNumber;
        payload.status = "pending";
      } else {
        if (!formData.receiptFile) {
          alert("Please upload evidence (receipt/screenshot) for this payment.");
          setSubmitting(false);
          return;
        }
        payload.receiptFile = formData.receiptFile;
        payload.receiptFilePublicId = formData.receiptFilePublicId;
        payload.receiptNumber = formData.receiptNumber || undefined;
        payload.status = "pending";
      }

      if (editingRecord) {
        await updateGiving(editingRecord.givingId, payload, token);
      } else {
        await createGiving(payload, token);
      }
      setShowModal(false);
      await loadData();
    } catch (error: any) {
      console.error("Failed to save giving:", error);
      alert(error.response?.data?.message || "Failed to save giving record.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteGiving(deleteTargetId, token);
      setShowDeleteModal(false);
      setDeleteTargetId(null);
      await loadData();
    } catch (error) {
      console.error("Failed to delete giving:", error);
      alert("Failed to delete giving record.");
    }
  };

  const hasActiveFilters = !!(searchTerm || filterCategory !== "all" || filterType !== "all" || filterStatus !== "all" || startDate || endDate);

  if (loading) {
    return (
      <div className="member-giving-loading">
        <div className="member-giving-loading-spinner"></div>
        <p>Loading giving records...</p>
      </div>
    );
  }

  const totalAmount = giving.reduce((sum, g) => sum + parseFloat(g.amount), 0);
  const isMpesa = formData.paymentMethod === "mpesa";

  return (
    <div className="member-giving-page">
      <div className="member-giving-header">
        <div>
          <h2 className="member-giving-title">My Giving</h2>
          <p className="member-giving-subtitle">Track your tithes and offerings</p>
        </div>
        <button className="member-giving-add-btn" onClick={handleCreate}>
          Record Giving
        </button>
      </div>

      <div className="member-giving-stats">
        <div className="member-giving-stat">
          <span className="member-giving-stat-value">{giving.length}</span>
          <span className="member-giving-stat-label">Total Records</span>
        </div>
        <div className="member-giving-stat">
          <span className="member-giving-stat-value">{formatCurrency(totalAmount.toString())}</span>
          <span className="member-giving-stat-label">Total Giving</span>
        </div>
        <div className="member-giving-stat">
          <span className="member-giving-stat-value">
            {giving.length > 0 ? formatCurrency((totalAmount / giving.length).toString()) : "KES 0.00"}
          </span>
          <span className="member-giving-stat-label">Average</span>
        </div>
        <div className="member-giving-stat">
          <span className="member-giving-stat-value">
            {giving.filter(g => g.status === 'completed').length}
          </span>
          <span className="member-giving-stat-label">Completed</span>
        </div>
      </div>

      <div className="member-giving-filters">
        <div className="member-giving-filter-group">
          <label>Search</label>
          <input
            type="text"
            placeholder="Search by notes or receipt..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="member-giving-filter-group">
          <label>Category</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="member-giving-filter-group">
          <label>Type</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="tithe">Tithe</option>
            <option value="offering">Offering</option>
            <option value="pledge">Pledge</option>
            <option value="donation">Donation</option>
            <option value="special">Special</option>
          </select>
        </div>
        <div className="member-giving-filter-group">
          <label>Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
        <div className="member-giving-filter-group">
          <label>From</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="member-giving-filter-group">
          <label>To</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        {hasActiveFilters && (
          <button className="member-giving-clear-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        )}
      </div>

      <div className="member-giving-table-wrapper">
        {filteredGiving.length > 0 ? (
          <table className="member-giving-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Method</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGiving.map((record) => (
                <tr key={record.givingId}>
                  <td>{formatDate(record.date)}</td>
                  <td>{getCategoryName(record.categoryId)}</td>
                  <td>
                    <span className="member-giving-type">{record.type}</span>
                  </td>
                  <td className="member-giving-amount">{formatCurrency(record.amount)}</td>
                  <td>
                    <span className={`member-giving-status status-${record.status}`}>
                      {record.status}
                    </span>
                  </td>
                  <td>{record.paymentMethod || "—"}</td>
                  <td>{record.notes || "—"}</td>
                  <td>
                    <div className="member-giving-actions">
                      <button
                        className="member-giving-action-edit"
                        onClick={() => handleEdit(record)}
                      >
                        Edit
                      </button>
                      <button
                        className="member-giving-action-delete"
                        onClick={() => {
                          setDeleteTargetId(record.givingId);
                          setShowDeleteModal(true);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="member-giving-empty">
            <p>No giving records found</p>
            <span>Record your first giving</span>
          </div>
        )}
      </div>

      {filteredGiving.length > 0 && (
        <div className="member-giving-count">
          Showing {filteredGiving.length} of {giving.length} records
          {hasActiveFilters && " (filtered)"}
        </div>
      )}

      {showModal && (
        <div className="member-giving-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="member-giving-modal" onClick={(e) => e.stopPropagation()}>
            <div className="member-giving-modal-header">
              <h3>{editingRecord ? "Edit Giving" : "Record Giving"}</h3>
              <button className="member-giving-modal-close" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
            <form onSubmit={handleSubmit} className="member-giving-modal-form">
              <div className="member-giving-form-row">
                <div className="member-giving-form-group">
                  <label>Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.filter(c => c.isActive).map((c) => (
                      <option key={c.categoryId} value={c.categoryId}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="member-giving-form-group">
                  <label>Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="tithe">Tithe</option>
                    <option value="offering">Offering</option>
                    <option value="pledge">Pledge</option>
                    <option value="donation">Donation</option>
                    <option value="special">Special</option>
                  </select>
                </div>
              </div>

              <div className="member-giving-form-row">
                <div className="member-giving-form-group">
                  <label>Amount</label>
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
                <div className="member-giving-form-group">
                  <label>Date</label>
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
                    required
                  >
                    <option value="">Select method</option>
                    <option value="mpesa">M-Pesa</option>
                    <option value="other">Upload Evidence</option>
                  </select>
                </div>
                <div className="member-giving-form-group">
                  <label>Status</label>
                  <input
                    type="text"
                    value="Pending"
                    disabled
                    className="member-giving-status-disabled"
                  />
                </div>
              </div>

              {isMpesa && (
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
                    STK push will be sent to this number. Auto-filled from your profile.
                  </small>
                </div>
              )}

              {!isMpesa && (
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

              {!isMpesa && (
                <div className="member-giving-form-group">
                  <label>Receipt Number (Optional)</label>
                  <input
                    type="text"
                    value={formData.receiptNumber}
                    onChange={(e) => setFormData({ ...formData, receiptNumber: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
              )}

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

              <div className="member-giving-modal-actions">
                <button
                  type="button"
                  className="member-giving-modal-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="member-giving-modal-submit"
                  disabled={submitting || uploadingFile || (isMpesa && !formData.phoneNumber) || (!isMpesa && !formData.receiptFile)}
                >
                  {submitting ? "Saving..." : isMpesa ? <><FiSend size={16} /> Send STK Push</> : "Submit for Approval"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="member-giving-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="member-giving-modal member-giving-modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="member-giving-modal-header">
              <h3>Delete Record</h3>
              <button className="member-giving-modal-close" onClick={() => setShowDeleteModal(false)}>
                Close
              </button>
            </div>
            <div className="member-giving-modal-body">
              <p>Are you sure you want to delete this giving record?</p>
              <p className="member-giving-modal-warning">This action cannot be undone.</p>
            </div>
            <div className="member-giving-modal-actions">
              <button
                className="member-giving-modal-cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="member-giving-modal-danger"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}