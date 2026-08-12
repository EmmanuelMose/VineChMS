import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchVisitors, createVisitor, updateVisitor, deleteVisitor, convertVisitorToMember, type Visitor } from "../../../../Features/visitors/visitorsAPI";
import { fetchServices, type Service } from "../../../../Features/services/servicesAPI";
import { fetchMemberByUserId } from "../../../../Features/members/membersAPI";
import { FiSearch, FiX, FiPlus, FiEdit2, FiTrash2, FiUserPlus } from "react-icons/fi";
import "./Visitors.css";

export default function Visitors() {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  const userId = useSelector((state: any) => state.user.user?.userId);

  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [, setMemberId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVisitors, setFilteredVisitors] = useState<Visitor[]>([]);
  
  const [showModal, setShowModal] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState<Visitor | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [convertTargetId, setConvertTargetId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    visitedDate: new Date().toISOString().split("T")[0],
    serviceId: "",
    notes: "",
  });

  const [convertFormData, setConvertFormData] = useState({
    role: "church_member",
    isActive: true,
    notes: "",
  });

  useEffect(() => {
    const loadMemberId = async () => {
      if (token && userId) {
        try {
          const member = await fetchMemberByUserId(userId, token);
          if (member && member.memberId) {
            setMemberId(member.memberId);
          }
        } catch (error) {
          console.error("Failed to load member ID:", error);
        }
      }
    };
    loadMemberId();
  }, [token, userId]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterVisitors();
  }, [visitors, searchTerm]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [visitorsData, servicesData] = await Promise.all([
        fetchVisitors(token),
        fetchServices(token),
      ]);
      const churchVisitors = visitorsData.filter((v) => v.churchId === churchId);
      const churchServices = servicesData.filter((s) => s.churchId === churchId);
      setVisitors(churchVisitors);
      setServices(churchServices);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterVisitors = () => {
    let filtered = [...visitors];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.fullName.toLowerCase().includes(term) ||
          (v.email || "").toLowerCase().includes(term) ||
          (v.phone || "").toLowerCase().includes(term) ||
          (v.notes || "").toLowerCase().includes(term)
      );
    }
    setFilteredVisitors(filtered);
  };

  const handleCreate = () => {
    setEditingVisitor(null);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      address: "",
      visitedDate: new Date().toISOString().split("T")[0],
      serviceId: "",
      notes: "",
    });
    setShowModal(true);
  };

  const handleEdit = (visitor: Visitor) => {
    setEditingVisitor(visitor);
    const date = new Date(visitor.visitedDate);
    setFormData({
      fullName: visitor.fullName,
      email: visitor.email || "",
      phone: visitor.phone || "",
      address: visitor.address || "",
      visitedDate: date.toISOString().split("T")[0],
      serviceId: visitor.serviceId?.toString() || "",
      notes: visitor.notes || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        churchId: churchId!,
        fullName: formData.fullName,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        visitedDate: new Date(formData.visitedDate).toISOString(),
        serviceId: formData.serviceId ? parseInt(formData.serviceId) : undefined,
        notes: formData.notes || undefined,
      };

      if (editingVisitor) {
        await updateVisitor(editingVisitor.visitorId, payload, token);
      } else {
        await createVisitor(payload, token);
      }
      setShowModal(false);
      await loadData();
    } catch (error: any) {
      console.error("Failed to save visitor:", error);
      alert(error.response?.data?.message || "Failed to save visitor.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    setSubmitting(true);
    try {
      const result = await deleteVisitor(deleteTargetId, token);
      if (result.success) {
        setShowDeleteModal(false);
        setDeleteTargetId(null);
        await loadData();
      } else {
        alert(result.message || "Failed to delete visitor.");
      }
    } catch (error: any) {
      console.error("Failed to delete visitor:", error);
      if (error.response) {
        const msg = error.response.data?.message || "Failed to delete visitor.";
        if (msg.toLowerCase().includes("not found") || msg.toLowerCase().includes("already")) {
          alert("This visitor has already been deleted.");
          setShowDeleteModal(false);
          setDeleteTargetId(null);
          await loadData();
        } else {
          alert(msg);
        }
      } else {
        alert("Failed to delete visitor. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleConvertClick = (visitorId: number) => {
    setConvertTargetId(visitorId);
    setConvertFormData({
      role: "church_member",
      isActive: true,
      notes: "",
    });
    setShowConvertModal(true);
  };

  const handleConvert = async () => {
    if (!convertTargetId) return;
    setSubmitting(true);
    try {
      const result = await convertVisitorToMember(convertTargetId, {
        role: convertFormData.role,
        isActive: convertFormData.isActive,
        notes: convertFormData.notes || undefined,
      }, token);
      
      if (result.member) {
        setShowConvertModal(false);
        setConvertTargetId(null);
        await loadData();
        alert("Visitor converted to member successfully!");
      } else {
        alert("Failed to convert visitor. Please try again.");
      }
    } catch (error: any) {
      console.error("Failed to convert visitor:", error);
      if (error.response) {
        const msg = error.response.data?.message || "Failed to convert visitor.";
        if (msg.toLowerCase().includes("already") || msg.toLowerCase().includes("exists")) {
          alert("This visitor has already been converted to a member.");
          setShowConvertModal(false);
          setConvertTargetId(null);
          await loadData();
        } else if (msg.toLowerCase().includes("not found")) {
          alert("This visitor no longer exists.");
          setShowConvertModal(false);
          setConvertTargetId(null);
          await loadData();
        } else {
          alert(msg);
        }
      } else {
        alert("Failed to convert visitor. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getServiceName = (serviceId?: number) => {
    if (!serviceId) return "N/A";
    const service = services.find((s) => s.serviceId === serviceId);
    return service ? service.name : "Unknown";
  };

  if (loading) {
    return (
      <div className="admin-visitors-loading">
        <div className="admin-visitors-loading-spinner"></div>
        <p>Loading visitors...</p>
      </div>
    );
  }

  const totalVisitors = visitors.length;
  const convertedVisitors = visitors.filter((v) => v.isMember).length;

  return (
    <div className="admin-visitors-page">
      <div className="admin-visitors-header">
        <div>
          <h2 className="admin-visitors-title">Visitors</h2>
          <p className="admin-visitors-subtitle">Track and manage church visitors</p>
        </div>
        <button className="admin-visitors-add-btn" onClick={handleCreate}>
          <FiPlus size={18} />
          Add Visitor
        </button>
      </div>

      <div className="admin-visitors-stats">
        <div className="admin-visitors-stat">
          <span className="admin-visitors-stat-value">{totalVisitors}</span>
          <span className="admin-visitors-stat-label">Total Visitors</span>
        </div>
        <div className="admin-visitors-stat">
          <span className="admin-visitors-stat-value">{convertedVisitors}</span>
          <span className="admin-visitors-stat-label">Converted to Members</span>
        </div>
        <div className="admin-visitors-stat">
          <span className="admin-visitors-stat-value">{totalVisitors - convertedVisitors}</span>
          <span className="admin-visitors-stat-label">Unconverted</span>
        </div>
        <div className="admin-visitors-stat">
          <span className="admin-visitors-stat-value">
            {totalVisitors > 0 ? Math.round((convertedVisitors / totalVisitors) * 100) : 0}%
          </span>
          <span className="admin-visitors-stat-label">Conversion Rate</span>
        </div>
      </div>

      <div className="admin-visitors-search">
        <div className="admin-visitors-search-wrapper">
          <FiSearch className="admin-visitors-search-icon" />
          <input
            type="text"
            placeholder="Search visitors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-visitors-search-input"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="admin-visitors-search-clear">
              <FiX size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="admin-visitors-table-wrapper">
        {filteredVisitors.length > 0 ? (
          <table className="admin-visitors-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Visited Date</th>
                <th>Service</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVisitors.map((visitor) => (
                <tr key={visitor.visitorId}>
                  <td className="admin-visitors-name">{visitor.fullName}</td>
                  <td>{visitor.email || "—"}</td>
                  <td>{visitor.phone || "—"}</td>
                  <td>{formatDate(visitor.visitedDate)}</td>
                  <td>{getServiceName(visitor.serviceId)}</td>
                  <td>
                    <span className={`admin-visitors-status ${visitor.isMember ? "status-member" : "status-visitor"}`}>
                      {visitor.isMember ? "Member" : "Visitor"}
                    </span>
                  </td>
                  <td>
                    <div className="admin-visitors-actions">
                      <button className="admin-visitors-action-edit" onClick={() => handleEdit(visitor)}>
                        <FiEdit2 size={14} /> Edit
                      </button>
                      {!visitor.isMember && (
                        <button
                          className="admin-visitors-action-convert"
                          onClick={() => handleConvertClick(visitor.visitorId)}
                        >
                          <FiUserPlus size={14} /> Convert
                        </button>
                      )}
                      <button
                        className="admin-visitors-action-delete"
                        onClick={() => {
                          setDeleteTargetId(visitor.visitorId);
                          setShowDeleteModal(true);
                        }}
                      >
                        <FiTrash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="admin-visitors-empty">
            <p>No visitors found</p>
          </div>
        )}
      </div>

      {filteredVisitors.length > 0 && (
        <div className="admin-visitors-count">
          Showing {filteredVisitors.length} of {visitors.length} visitors
          {searchTerm && " (filtered)"}
        </div>
      )}

      {showModal && (
        <div className="admin-visitors-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-visitors-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-visitors-modal-header">
              <h3>{editingVisitor ? "Edit Visitor" : "Add Visitor"}</h3>
              <button className="admin-visitors-modal-close" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
            <form onSubmit={handleSubmit} className="admin-visitors-modal-form">
              <div className="admin-visitors-form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="admin-visitors-form-row">
                <div className="admin-visitors-form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>
                <div className="admin-visitors-form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 234 567 890"
                  />
                </div>
              </div>
              <div className="admin-visitors-form-group">
                <label>Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Main St, City"
                />
              </div>
              <div className="admin-visitors-form-row">
                <div className="admin-visitors-form-group">
                  <label>Visited Date *</label>
                  <input
                    type="date"
                    value={formData.visitedDate}
                    onChange={(e) => setFormData({ ...formData, visitedDate: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-visitors-form-group">
                  <label>Service</label>
                  <select
                    value={formData.serviceId}
                    onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                  >
                    <option value="">Select service</option>
                    {services.filter(s => s.isActive).map((s) => (
                      <option key={s.serviceId} value={s.serviceId}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="admin-visitors-form-group">
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  placeholder="Additional notes about this visitor..."
                />
              </div>
              <div className="admin-visitors-modal-actions">
                <button type="button" className="admin-visitors-modal-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-visitors-modal-submit" disabled={submitting}>
                  {submitting ? "Saving..." : editingVisitor ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="admin-visitors-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="admin-visitors-modal admin-visitors-modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="admin-visitors-modal-header">
              <h3>Delete Visitor</h3>
              <button className="admin-visitors-modal-close" onClick={() => setShowDeleteModal(false)}>
                Close
              </button>
            </div>
            <div className="admin-visitors-modal-body">
              <p>Are you sure you want to delete this visitor?</p>
              <p className="admin-visitors-modal-warning">This action cannot be undone.</p>
            </div>
            <div className="admin-visitors-modal-actions">
              <button className="admin-visitors-modal-cancel" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="admin-visitors-modal-danger" onClick={handleDelete} disabled={submitting}>
                {submitting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showConvertModal && (
        <div className="admin-visitors-modal-overlay" onClick={() => setShowConvertModal(false)}>
          <div className="admin-visitors-modal admin-visitors-modal-convert" onClick={(e) => e.stopPropagation()}>
            <div className="admin-visitors-modal-header">
              <h3>Convert Visitor to Member</h3>
              <button className="admin-visitors-modal-close" onClick={() => setShowConvertModal(false)}>
                Close
              </button>
            </div>
            <div className="admin-visitors-modal-body">
              <div className="admin-visitors-form-group">
                <label>Role</label>
                <select
                  value={convertFormData.role}
                  onChange={(e) => setConvertFormData({ ...convertFormData, role: e.target.value })}
                >
                  <option value="church_member">Church Member</option>
                  <option value="pastor">Pastor</option>
                  <option value="elder">Elder</option>
                  <option value="treasurer">Treasurer</option>
                  <option value="secretary">Secretary</option>
                </select>
              </div>
              <div className="admin-visitors-form-group">
                <label>Status</label>
                <select
                  value={convertFormData.isActive ? "active" : "inactive"}
                  onChange={(e) => setConvertFormData({ ...convertFormData, isActive: e.target.value === "active" })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="admin-visitors-form-group">
                <label>Notes</label>
                <textarea
                  value={convertFormData.notes}
                  onChange={(e) => setConvertFormData({ ...convertFormData, notes: e.target.value })}
                  rows={2}
                  placeholder="Additional notes about conversion..."
                />
              </div>
            </div>
            <div className="admin-visitors-modal-actions">
              <button type="button" className="admin-visitors-modal-cancel" onClick={() => setShowConvertModal(false)}>
                Cancel
              </button>
              <button type="button" className="admin-visitors-modal-convert-btn" onClick={handleConvert} disabled={submitting}>
                {submitting ? "Converting..." : "Convert to Member"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}