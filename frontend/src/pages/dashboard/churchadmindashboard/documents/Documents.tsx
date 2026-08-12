import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { 
  FiSearch, FiX, FiPlus, FiEdit2, FiTrash2, 
  FiFile, FiDownload, FiEye, FiCalendar, FiLock, FiGlobe, FiUsers,
  FiRefreshCw, FiFolder
} from "react-icons/fi";
import { fetchDocuments, deleteDocument, restoreDocument, type Document } from "../../../../Features/documents/documentsAPI";
import CreateDocument from "./CreateDocument";
import UpdateDocument from "./UpdateDocument";
import "./Documents.css";

export default function Documents() {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [filterType, setFilterType] = useState("all");
  const [filterVisibility, setFilterVisibility] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleteType, setDeleteType] = useState<'soft' | 'hard'>('soft');
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await fetchDocuments(token);
      const filtered = data.filter(d => d.churchId === churchId);
      setDocuments(filtered);
    } catch (error) {
      console.error("Failed to load documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number, type: 'soft' | 'hard' = 'soft') => {
    setDeleteTargetId(id);
    setDeleteType(type);
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
      }
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await restoreDocument(id, token);
      await loadDocuments();
    } catch (error) {
      console.error("Failed to restore document:", error);
    }
  };

  const handleEdit = (doc: Document) => {
    setSelectedDocument(doc);
    setUpdateModalOpen(true);
  };

  const handleSuccess = () => {
    loadDocuments();
    setCreateModalOpen(false);
    setUpdateModalOpen(false);
    setSelectedDocument(null);
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
    switch(visibility) {
      case 'public': return <FiGlobe size={14} />;
      case 'members_only': return <FiUsers size={14} />;
      case 'leadership_only': return <FiLock size={14} />;
      default: return <FiLock size={14} />;
    }
  };

  const getVisibilityLabel = (visibility: string) => {
    return visibility.replace('_', ' ').toUpperCase();
  };

  const getFileIcon = (fileType?: string) => {
    if (fileType?.startsWith('image/')) return '🖼️';
    if (fileType?.startsWith('video/')) return '🎬';
    if (fileType?.startsWith('audio/')) return '🎵';
    if (fileType?.includes('pdf')) return '📄';
    if (fileType?.includes('word') || fileType?.includes('doc')) return '📝';
    if (fileType?.includes('excel') || fileType?.includes('sheet')) return '📊';
    if (fileType?.includes('zip') || fileType?.includes('rar')) return '📦';
    return '📁';
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesType = filterType === "all" || doc.documentType === filterType;
    const matchesVisibility = filterVisibility === "all" || doc.visibility === filterVisibility;
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "active" && doc.isActive) ||
      (filterStatus === "archived" && !doc.isActive);
    
    return matchesSearch && matchesType && matchesVisibility && matchesStatus;
  });

  const stats = {
    total: documents.length,
    active: documents.filter(d => d.isActive).length,
    archived: documents.filter(d => !d.isActive).length,
  };

  const documentTypes = [...new Set(documents.map(d => d.documentType).filter(Boolean))];

  if (loading) {
    return (
      <div className="documents-loading">
        <div className="documents-loading-spinner"></div>
        <p>Loading documents...</p>
      </div>
    );
  }

  return (
    <div className="documents-page">
      {showDeleteModal && (
        <div className="documents-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="documents-modal documents-modal-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="documents-modal-header">
              <h3>{deleteType === 'hard' ? 'Permanently Delete' : 'Delete'} Document</h3>
              <button onClick={() => setShowDeleteModal(false)} className="documents-modal-close">
                <FiX size={20} />
              </button>
            </div>
            <div className="documents-modal-body">
              <p>Are you sure you want to {deleteType === 'hard' ? 'permanently delete' : 'archive'} this document?</p>
              {deleteType === 'soft' && (
                <p className="documents-modal-info">You can restore it later from the archived list.</p>
              )}
              {deleteType === 'hard' && (
                <p className="documents-modal-warning">This action cannot be undone.</p>
              )}
            </div>
            <div className="documents-modal-actions">
              <button onClick={() => setShowDeleteModal(false)} className="documents-btn-cancel">
                Cancel
              </button>
              <button onClick={confirmDelete} className={deleteType === 'hard' ? 'documents-btn-danger' : 'documents-btn-archive'}>
                {deleteType === 'hard' ? 'Delete Permanently' : 'Archive'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="documents-header">
        <div>
          <h2 className="documents-title">Documents</h2>
          <p className="documents-subtitle">Manage church documents and files</p>
        </div>
        <div className="documents-actions">
          <button className="documents-btn-secondary" onClick={loadDocuments}>
            <FiRefreshCw size={16} />
            Refresh
          </button>
          <button onClick={() => setCreateModalOpen(true)} className="documents-btn-primary">
            <FiPlus size={16} />
            Upload Document
          </button>
        </div>
      </div>

      <div className="documents-stats-grid">
        <div className="documents-stat-card stat-total">
          <span className="documents-stat-value">{stats.total}</span>
          <span className="documents-stat-label">Total Documents</span>
        </div>
        <div className="documents-stat-card stat-active">
          <span className="documents-stat-value">{stats.active}</span>
          <span className="documents-stat-label">Active</span>
        </div>
        <div className="documents-stat-card stat-archived">
          <span className="documents-stat-value">{stats.archived}</span>
          <span className="documents-stat-label">Archived</span>
        </div>
      </div>

      <div className="documents-toolbar">
        <div className="documents-search">
          <FiSearch className="documents-search-icon" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="documents-search-input"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="documents-search-clear">
              <FiX size={16} />
            </button>
          )}
        </div>
        <div className="documents-filters">
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="documents-filter-select"
          >
            <option value="all">All Types</option>
            {documentTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select 
            value={filterVisibility} 
            onChange={(e) => setFilterVisibility(e.target.value)}
            className="documents-filter-select"
          >
            <option value="all">All Visibility</option>
            <option value="public">Public</option>
            <option value="members_only">Members Only</option>
            <option value="leadership_only">Leadership Only</option>
            <option value="private">Private</option>
          </select>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="documents-filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="documents-grid">
        {filteredDocuments.map((doc) => (
          <div key={doc.documentId} className="documents-card">
            {doc.thumbnail ? (
              <div className="documents-card-thumbnail">
                <img src={doc.thumbnail} alt={doc.title} />
              </div>
            ) : (
              <div className="documents-card-thumbnail documents-card-thumbnail-placeholder">
                <span className="documents-card-file-icon">{getFileIcon(doc.fileType)}</span>
              </div>
            )}
            <div className="documents-card-content">
              <div className="documents-card-header">
                <h3 className="documents-card-title">{doc.title}</h3>
                <span className={`documents-card-status ${doc.isActive ? 'status-active' : 'status-archived'}`}>
                  {doc.isActive ? 'Active' : 'Archived'}
                </span>
              </div>

              {doc.description && (
                <p className="documents-card-description">{doc.description}</p>
              )}

              <div className="documents-card-meta">
                <span className="documents-card-meta-item">
                  {getVisibilityIcon(doc.visibility)}
                  {getVisibilityLabel(doc.visibility)}
                </span>
                <span className="documents-card-meta-item">
                  <FiFile size={14} />
                  {doc.fileName}
                </span>
                {doc.fileSize && (
                  <span className="documents-card-meta-item">
                    {formatFileSize(doc.fileSize)}
                  </span>
                )}
                {doc.documentType && (
                  <span className="documents-card-meta-item documents-card-type">
                    {doc.documentType}
                  </span>
                )}
                {doc.version && doc.version > 1 && (
                  <span className="documents-card-meta-item">
                    v{doc.version}
                  </span>
                )}
              </div>

              <div className="documents-card-footer">
                <div className="documents-card-date">
                  <FiCalendar size={14} />
                  <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="documents-card-actions">
                  {!doc.isActive && (
                    <button 
                      onClick={() => handleRestore(doc.documentId)} 
                      className="documents-card-btn documents-btn-restore"
                      title="Restore"
                    >
                      <FiRefreshCw size={14} /> Restore
                    </button>
                  )}
                  <a 
                    href={doc.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="documents-card-btn documents-btn-view"
                  >
                    <FiEye size={14} /> View
                  </a>
                  <button 
                    onClick={() => handleDownload(doc)} 
                    className="documents-card-btn documents-btn-download"
                    disabled={downloadingId === doc.documentId}
                  >
                    <FiDownload size={14} />
                    {downloadingId === doc.documentId ? '...' : ''}
                  </button>
                  <button 
                    onClick={() => handleEdit(doc)} 
                    className="documents-card-btn documents-btn-edit"
                    disabled={!doc.isActive}
                  >
                    <FiEdit2 size={14} />
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(doc.documentId, doc.isActive ? 'soft' : 'hard')} 
                    className={`documents-card-btn ${doc.isActive ? 'documents-btn-archive' : 'documents-btn-delete'}`}
                  >
                    {doc.isActive ? <FiTrash2 size={14} /> : <FiX size={14} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredDocuments.length === 0 && (
          <div className="documents-empty">
            <FiFolder size={48} />
            <p>No documents found</p>
            <span>Upload your first document to get started</span>
          </div>
        )}
      </div>

      <CreateDocument
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleSuccess}
        churchId={churchId}
      />

      {selectedDocument && (
        <UpdateDocument
          isOpen={updateModalOpen}
          onClose={() => {
            setUpdateModalOpen(false);
            setSelectedDocument(null);
          }}
          onSuccess={handleSuccess}
          document={selectedDocument}
        />
      )}
    </div>
  );
}