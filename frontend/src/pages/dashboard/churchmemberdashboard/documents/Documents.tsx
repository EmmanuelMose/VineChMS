import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiSearch, FiX, FiDownload, FiEye, FiCalendar, FiFile, FiGlobe, FiUsers, FiLock, FiUpload, FiEdit2, FiTrash2 } from "react-icons/fi";
import { fetchDocuments, deleteDocument, restoreDocument, type Document } from "../../../../Features/documents/documentsAPI";
import CreateDocument from "./CreateDocument";
import UpdateDocument from "./UpdateDocumement";
import "./Documents.css";

export default function Documents() {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  const userRole = useSelector((state: any) => state.user.user?.role);

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterVisibility, setFilterVisibility] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [restoreTargetId, setRestoreTargetId] = useState<number | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const canManageDocuments = userRole === "secretary" || userRole === "church_admin" || userRole === "pastor" || userRole === "elder";
  const canViewAllDocuments = userRole === "church_admin" || userRole === "secretary";

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    filterDocuments();
  }, [documents, searchTerm, filterType, filterVisibility, filterStatus]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await fetchDocuments(token);
      const churchDocs = data.filter((d) => d.churchId === churchId);
      
      let visibleDocs = churchDocs;
      if (!canViewAllDocuments) {
        visibleDocs = churchDocs.filter(
          (d) => d.visibility === "public" || d.visibility === "members_only"
        );
      }
      
      setDocuments(visibleDocs);
    } catch (error) {
      console.error("Failed to load documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterDocuments = () => {
    let filtered = [...documents];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.title.toLowerCase().includes(term) ||
          (d.description || "").toLowerCase().includes(term) ||
          d.fileName.toLowerCase().includes(term)
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter((d) => d.documentType === filterType);
    }

    if (filterVisibility !== "all") {
      filtered = filtered.filter((d) => d.visibility === filterVisibility);
    }

    if (filterStatus === "active") {
      filtered = filtered.filter((d) => d.isActive);
    } else if (filterStatus === "archived") {
      filtered = filtered.filter((d) => !d.isActive);
    }

    setFilteredDocuments(filtered);
  };

  const handleDownload = async (doc: Document) => {
    if (!doc.fileUrl) return;
    setDownloadingId(doc.documentId);
    try {
      const response = await fetch(doc.fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download the file. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "public":
        return <FiGlobe size={14} />;
      case "members_only":
        return <FiUsers size={14} />;
      case "leadership_only":
        return <FiLock size={14} />;
      default:
        return <FiLock size={14} />;
    }
  };

  const getVisibilityLabel = (visibility: string) => {
    const labels: Record<string, string> = {
      public: "Public",
      members_only: "Members Only",
      leadership_only: "Leadership Only",
      private: "Private"
    };
    return labels[visibility] || visibility;
  };

  const getFileIcon = (fileType?: string) => {
    if (fileType?.startsWith("image/")) return "🖼️";
    if (fileType?.startsWith("video/")) return "🎬";
    if (fileType?.startsWith("audio/")) return "🎵";
    if (fileType?.includes("pdf")) return "📄";
    if (fileType?.includes("word") || fileType?.includes("doc")) return "📝";
    if (fileType?.includes("excel") || fileType?.includes("sheet")) return "📊";
    if (fileType?.includes("zip") || fileType?.includes("rar")) return "📦";
    return "📁";
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const handleEdit = (doc: Document) => {
    setEditingDocument(doc);
    setShowUpdateModal(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deleteTargetId) {
      try {
        await deleteDocument(deleteTargetId, token);
        await loadDocuments();
        setShowDeleteModal(false);
        setDeleteTargetId(null);
      } catch (error) {
        console.error("Failed to delete document:", error);
        alert("Failed to delete document.");
      }
    }
  };

  const handleRestoreClick = (id: number) => {
    setRestoreTargetId(id);
    setShowRestoreModal(true);
  };

  const confirmRestore = async () => {
    if (restoreTargetId) {
      try {
        await restoreDocument(restoreTargetId, token);
        await loadDocuments();
        setShowRestoreModal(false);
        setRestoreTargetId(null);
      } catch (error) {
        console.error("Failed to restore document:", error);
        alert("Failed to restore document.");
      }
    }
  };

  const handleSuccess = () => {
    loadDocuments();
    setShowCreateModal(false);
    setShowUpdateModal(false);
    setEditingDocument(null);
  };

  const documentTypes = [...new Set(documents.map((d) => d.documentType).filter(Boolean))];
  const visibilityOptions = ["public", "members_only", "leadership_only", "private"];

  if (loading) {
    return (
      <div className="member-documents-loading">
        <div className="member-documents-loading-spinner"></div>
        <p>Loading documents...</p>
      </div>
    );
  }

  return (
    <div className="member-documents-page">
      <CreateDocument
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleSuccess}
      />

      {editingDocument && (
        <UpdateDocument
          isOpen={showUpdateModal}
          onClose={() => {
            setShowUpdateModal(false);
            setEditingDocument(null);
          }}
          onSuccess={handleSuccess}
          document={editingDocument}
        />
      )}

      {showDeleteModal && (
        <div className="member-documents-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="member-documents-modal" onClick={(e) => e.stopPropagation()}>
            <div className="member-documents-modal-header">
              <h3>Delete Document</h3>
              <button className="member-documents-modal-close" onClick={() => setShowDeleteModal(false)}>
                Close
              </button>
            </div>
            <div className="member-documents-modal-body">
              <p>Are you sure you want to delete this document?</p>
              <p className="member-documents-modal-warning">This will move it to the archive. You can restore it later.</p>
            </div>
            <div className="member-documents-modal-actions">
              <button className="member-documents-modal-cancel" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="member-documents-modal-danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showRestoreModal && (
        <div className="member-documents-modal-overlay" onClick={() => setShowRestoreModal(false)}>
          <div className="member-documents-modal" onClick={(e) => e.stopPropagation()}>
            <div className="member-documents-modal-header">
              <h3>Restore Document</h3>
              <button className="member-documents-modal-close" onClick={() => setShowRestoreModal(false)}>
                Close
              </button>
            </div>
            <div className="member-documents-modal-body">
              <p>Are you sure you want to restore this document?</p>
              <p className="member-documents-modal-info">The document will become active again.</p>
            </div>
            <div className="member-documents-modal-actions">
              <button className="member-documents-modal-cancel" onClick={() => setShowRestoreModal(false)}>
                Cancel
              </button>
              <button className="member-documents-modal-restore" onClick={confirmRestore}>
                Restore
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="member-documents-header">
        <div>
          <h2 className="member-documents-title">Documents</h2>
          <p className="member-documents-subtitle">View and download church documents</p>
        </div>
        {canManageDocuments && (
          <button className="member-documents-add-btn" onClick={() => setShowCreateModal(true)}>
            <FiUpload size={18} />
            Upload Document
          </button>
        )}
      </div>

      <div className="member-documents-toolbar">
        <div className="member-documents-search">
          <FiSearch className="member-documents-search-icon" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="member-documents-search-input"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="member-documents-search-clear">
              <FiX size={16} />
            </button>
          )}
        </div>
        <div className="member-documents-filters">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="member-documents-filter-select"
          >
            <option value="all">All Types</option>
            {documentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select
            value={filterVisibility}
            onChange={(e) => setFilterVisibility(e.target.value)}
            className="member-documents-filter-select"
          >
            <option value="all">All Visibility</option>
            {visibilityOptions.map((v) => (
              <option key={v} value={v}>
                {getVisibilityLabel(v)}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="member-documents-filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="member-documents-grid">
        {filteredDocuments.length > 0 ? (
          filteredDocuments.map((doc) => (
            <div key={doc.documentId} className="member-documents-card">
              {doc.thumbnail ? (
                <div className="member-documents-card-thumbnail">
                  <img src={doc.thumbnail} alt={doc.title} />
                </div>
              ) : (
                <div className="member-documents-card-thumbnail member-documents-card-thumbnail-placeholder">
                  <span className="member-documents-card-file-icon">{getFileIcon(doc.fileType)}</span>
                </div>
              )}
              <div className="member-documents-card-content">
                <div className="member-documents-card-header">
                  <h3 className="member-documents-card-title">{doc.title}</h3>
                  <span className={`member-documents-card-status ${doc.isActive ? "status-active" : "status-archived"}`}>
                    {doc.isActive ? "Active" : "Archived"}
                  </span>
                </div>

                {doc.description && (
                  <p className="member-documents-card-description">{doc.description}</p>
                )}

                <div className="member-documents-card-meta">
                  <span className="member-documents-card-meta-item">
                    {getVisibilityIcon(doc.visibility)}
                    {getVisibilityLabel(doc.visibility)}
                  </span>
                  <span className="member-documents-card-meta-item">
                    <FiFile size={14} />
                    {doc.fileName}
                  </span>
                  {doc.fileSize && (
                    <span className="member-documents-card-meta-item">
                      {formatFileSize(doc.fileSize)}
                    </span>
                  )}
                  {doc.documentType && (
                    <span className="member-documents-card-meta-item member-documents-card-type">
                      {doc.documentType}
                    </span>
                  )}
                  {doc.version && doc.version > 1 && (
                    <span className="member-documents-card-meta-item">v{doc.version}</span>
                  )}
                </div>

                <div className="member-documents-card-footer">
                  <div className="member-documents-card-date">
                    <FiCalendar size={14} />
                    <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="member-documents-card-actions">
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="member-documents-card-btn member-documents-btn-view"
                    >
                      <FiEye size={14} /> View
                    </a>
                    <button
                      onClick={() => handleDownload(doc)}
                      className="member-documents-card-btn member-documents-btn-download"
                      disabled={downloadingId === doc.documentId}
                    >
                      <FiDownload size={14} />
                      {downloadingId === doc.documentId ? '...' : ''}
                    </button>
                    {canManageDocuments && (
                      <>
                        {doc.isActive ? (
                          <>
                            <button
                              className="member-documents-card-btn member-documents-btn-edit"
                              onClick={() => handleEdit(doc)}
                            >
                              <FiEdit2 size={14} /> Edit
                            </button>
                            <button
                              className="member-documents-card-btn member-documents-btn-delete"
                              onClick={() => handleDeleteClick(doc.documentId)}
                            >
                              <FiTrash2 size={14} /> Delete
                            </button>
                          </>
                        ) : (
                          <button
                            className="member-documents-card-btn member-documents-btn-restore"
                            onClick={() => handleRestoreClick(doc.documentId)}
                          >
                            Restore
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="member-documents-empty">
            <p>No documents available</p>
            <span>Check back later for updates</span>
          </div>
        )}
      </div>

      {filteredDocuments.length > 0 && (
        <div className="member-documents-count">
          Showing {filteredDocuments.length} of {documents.length} documents
        </div>
      )}
    </div>
  );
}