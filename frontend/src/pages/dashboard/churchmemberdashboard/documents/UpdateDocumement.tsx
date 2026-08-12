import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { updateDocument, type Document } from "../../../../Features/documents/documentsAPI";
import { uploadFileToCloudinary } from "../../../../Features/cloudinary/cloudinaryAPI";
import { FiX, FiUpload } from "react-icons/fi";
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
    visibility: "members_only" as "public" | "members_only" | "leadership_only" | "private",
    thumbnail: "",
    thumbnailPublicId: "",
  });

  const [submitting, setSubmitting] = useState(false);
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
        fileSize: document.fileSize ? document.fileSize.toString() : "",
        fileType: document.fileType || "",
        documentType: document.documentType || "",
        visibility: document.visibility,
        thumbnail: document.thumbnail || "",
        thumbnailPublicId: document.thumbnailPublicId || "",
      });
    }
  }, [document]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
    setSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description || undefined,
        fileName: formData.fileName,
        fileUrl: formData.fileUrl,
        filePublicId: formData.filePublicId || undefined,
        fileSize: formData.fileSize ? parseInt(formData.fileSize) : undefined,
        fileType: formData.fileType || undefined,
        documentType: formData.documentType || undefined,
        visibility: formData.visibility,
        thumbnail: formData.thumbnail || undefined,
        thumbnailPublicId: formData.thumbnailPublicId || undefined,
      };

      await updateDocument(document.documentId, payload, token);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update document");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="member-documents-modal-overlay" onClick={onClose}>
      <div className="member-documents-modal" onClick={(e) => e.stopPropagation()}>
        <div className="member-documents-modal-header">
          <h3>Edit Document</h3>
          <button onClick={onClose} className="member-documents-modal-close">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="member-documents-modal-form">
          <div className="member-documents-form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="member-documents-form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
            />
          </div>

          <div className="member-documents-form-group">
            <label>File Upload</label>
            <div className="member-documents-file-upload-wrapper">
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, "file");
                }}
                disabled={uploadingFile}
                className="member-documents-file-input"
                id="update-document-file"
              />
              <label htmlFor="update-document-file" className="member-documents-file-label">
                <FiUpload size={16} />
                {uploadingFile ? "Uploading..." : "Change File"}
              </label>
            </div>
            {formData.fileUrl && (
              <div className="member-documents-file-preview">
                <span>{formData.fileName}</span>
                <button
                  type="button"
                  className="member-documents-remove-file"
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

          <div className="member-documents-form-group">
            <label>Thumbnail (optional)</label>
            <div className="member-documents-file-upload-wrapper">
              <input
                type="file"
                accept="image/*"
                ref={thumbnailInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, "thumbnail");
                }}
                disabled={uploadingThumbnail}
                className="member-documents-file-input"
                id="update-document-thumbnail"
              />
              <label htmlFor="update-document-thumbnail" className="member-documents-file-label">
                <FiUpload size={16} />
                {uploadingThumbnail ? "Uploading..." : formData.thumbnail ? "Change Thumbnail" : "Choose Thumbnail"}
              </label>
            </div>
            {formData.thumbnail && (
              <div className="member-documents-thumbnail-preview">
                <img src={formData.thumbnail} alt="Thumbnail" />
                <button
                  type="button"
                  className="member-documents-remove-file"
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

          <div className="member-documents-form-row">
            <div className="member-documents-form-group">
              <label>Document Type</label>
              <input
                type="text"
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
              />
            </div>
            <div className="member-documents-form-group">
              <label>Visibility</label>
              <select
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
              >
                <option value="public">Public</option>
                <option value="members_only">Members Only</option>
                <option value="leadership_only">Leadership Only</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          {error && <div className="member-documents-form-error">{error}</div>}

          <div className="member-documents-modal-actions">
            <button type="button" onClick={onClose} className="member-documents-modal-cancel">
              Cancel
            </button>
            <button
              type="submit"
              className="member-documents-modal-submit"
              disabled={submitting || uploadingFile || uploadingThumbnail || !formData.fileUrl}
            >
              {submitting ? "Updating..." : "Update Document"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}