import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { FiX, FiUpload } from "react-icons/fi";
import { updateDocument, type Document } from "../../../../Features/documents/documentsAPI";
import { uploadFileToCloudinary } from "../../../../Features/cloudinary/cloudinaryAPI";
import "./UpdateDocument.css";

interface UpdateDocumentProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  document: Document;
}

export default function UpdateDocument({ isOpen, onClose, onSuccess, document }: UpdateDocumentProps) {
  const token = useSelector((state: any) => state.user.token);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fileName: "",
    fileUrl: "",
    filePublicId: "",
    fileSize: "",
    fileType: "",
    documentType: "",
    visibility: "members_only",
    thumbnail: "",
    thumbnailPublicId: "",
    version: "1",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  useEffect(() => {
    if (document) {
      setFormData({
        title: document.title,
        description: document.description || "",
        fileName: document.fileName,
        fileUrl: document.fileUrl,
        filePublicId: document.filePublicId || "",
        fileSize: document.fileSize ? String(document.fileSize) : "",
        fileType: document.fileType || "",
        documentType: document.documentType || "",
        visibility: document.visibility || "members_only",
        thumbnail: document.thumbnail || "",
        thumbnailPublicId: document.thumbnailPublicId || "",
        version: String(document.version || 1),
      });
    }
  }, [document]);

  const handleFileUpload = async (file: File, type: "file" | "thumbnail") => {
    if (!file) return;
    const setUploading = type === "file" ? setUploadingFile : setUploadingThumbnail;
    setUploading(true);
    try {
      const folder = type === "file" ? "vinechms/documents" : "vinechms/documents/thumbnails";
      const result = await uploadFileToCloudinary(file, token, folder, {
        resourceType: type === "file" ? "raw" : "image",
        quality: type === "thumbnail" ? 80 : undefined,
      });
      if (type === "file") {
        setFormData((prev) => ({
          ...prev,
          fileUrl: result.secureUrl,
          filePublicId: result.publicId,
          fileName: file.name,
          fileSize: String(file.size),
          fileType: file.type,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          thumbnail: result.secureUrl,
          thumbnailPublicId: result.publicId,
        }));
      }
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await updateDocument(document.documentId, {
        title: formData.title,
        description: formData.description || undefined,
        fileName: formData.fileName,
        fileUrl: formData.fileUrl,
        filePublicId: formData.filePublicId || undefined,
        fileSize: formData.fileSize ? Number(formData.fileSize) : undefined,
        fileType: formData.fileType || undefined,
        documentType: formData.documentType || undefined,
        visibility: formData.visibility as any,
        thumbnail: formData.thumbnail || undefined,
        thumbnailPublicId: formData.thumbnailPublicId || undefined,
        version: Number(formData.version),
      }, token);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update document");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="update-document-overlay" onClick={onClose}>
      <div className="update-document-modal" onClick={(e) => e.stopPropagation()}>
        <div className="update-document-header">
          <h3>Edit Document</h3>
          <button onClick={onClose} className="update-document-close">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="update-document-form">
          <div className="update-document-group">
            <label>Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="update-document-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
            />
          </div>

          <div className="update-document-group">
            <label>File Upload</label>
            <div className="update-document-file-upload-wrapper">
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, "file");
                }}
                disabled={uploadingFile}
                className="update-document-file-input"
                id="update-document-file"
              />
              <label htmlFor="update-document-file" className="update-document-file-label">
                <FiUpload size={16} />
                {uploadingFile ? "Uploading..." : "Change File"}
              </label>
            </div>
            {formData.fileUrl && (
              <div className="update-document-file-preview">
                <span>{formData.fileName}</span>
                <button
                  type="button"
                  className="update-document-remove-file"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      fileUrl: "",
                      filePublicId: "",
                      fileName: "",
                      fileSize: "",
                      fileType: "",
                    }));
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  <FiX size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="update-document-group">
            <label>Thumbnail (optional)</label>
            <div className="update-document-file-upload-wrapper">
              <input
                type="file"
                accept="image/*"
                ref={thumbnailInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, "thumbnail");
                }}
                disabled={uploadingThumbnail}
                className="update-document-file-input"
                id="update-document-thumbnail"
              />
              <label htmlFor="update-document-thumbnail" className="update-document-file-label">
                <FiUpload size={16} />
                {uploadingThumbnail ? "Uploading..." : formData.thumbnail ? "Change Thumbnail" : "Choose Thumbnail"}
              </label>
            </div>
            {formData.thumbnail && (
              <div className="update-document-thumbnail-preview">
                <img src={formData.thumbnail} alt="Thumbnail" />
                <button
                  type="button"
                  className="update-document-remove-file"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      thumbnail: "",
                      thumbnailPublicId: "",
                    }));
                    if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
                  }}
                >
                  <FiX size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="update-document-row">
            <div className="update-document-group">
              <label>Document Type</label>
              <input
                type="text"
                value={formData.documentType}
                onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
              />
            </div>
            <div className="update-document-group">
              <label>Visibility</label>
              <select
                value={formData.visibility}
                onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
              >
                <option value="public">Public</option>
                <option value="members_only">Members Only</option>
                <option value="leadership_only">Leadership Only</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          <div className="update-document-group">
            <label>Version</label>
            <input
              type="number"
              value={formData.version}
              onChange={(e) => setFormData({ ...formData, version: e.target.value })}
              min="1"
              step="1"
            />
          </div>

          {error && <div className="update-document-error">{error}</div>}
          
          <div className="update-document-actions">
            <button type="button" onClick={onClose} className="update-document-cancel">
              Cancel
            </button>
            <button 
              type="submit" 
              className="update-document-save" 
              disabled={loading || uploadingFile || uploadingThumbnail || !formData.fileUrl}
            >
              {loading ? "Updating..." : "Update Document"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}