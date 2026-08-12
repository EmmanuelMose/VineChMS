import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { FiX, FiUpload, FiVideo, FiMusic } from "react-icons/fi";
import { createSermon } from "../../../../Features/sermons/sermonsAPI";
import { uploadFileToCloudinary } from "../../../../Features/cloudinary/cloudinaryAPI";
import "./CreateSermon.css";

interface CreateSermonProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateSermon({ isOpen, onClose, onSuccess }: CreateSermonProps) {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    speaker: "",
    topic: "",
    scripture: "",
    description: "",
    videoUrl: "",
    audioUrl: "",
    notes: "",
    preachedAt: new Date().toISOString().split("T")[0],
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (file: File, type: "video" | "audio") => {
    if (!file) return;
    const setUploading = type === "video" ? setUploadingVideo : setUploadingAudio;
    setUploading(true);
    try {
      const folder = type === "video" ? "vinechms/sermons/videos" : "vinechms/sermons/audios";
      const result = await uploadFileToCloudinary(file, token, folder, {
        resourceType: type === "video" ? "video" : "auto",
        quality: 80,
      });
      if (type === "video") {
        setFormData((prev) => ({ ...prev, videoUrl: result.secureUrl }));
      } else {
        setFormData((prev) => ({ ...prev, audioUrl: result.secureUrl }));
      }
    } catch (err: any) {
      setError(err.message || `${type} upload failed`);
    } finally {
      setUploading(false);
      if (type === "video" && videoInputRef.current) videoInputRef.current.value = "";
      if (type === "audio" && audioInputRef.current) audioInputRef.current.value = "";
    }
  };

  const removeVideo = () => {
    setFormData((prev) => ({ ...prev, videoUrl: "" }));
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const removeAudio = () => {
    setFormData((prev) => ({ ...prev, audioUrl: "" }));
    if (audioInputRef.current) audioInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const payload = {
        churchId: churchId!,
        title: formData.title,
        speaker: formData.speaker,
        topic: formData.topic || undefined,
        scripture: formData.scripture || undefined,
        description: formData.description || undefined,
        videoUrl: formData.videoUrl || undefined,
        audioUrl: formData.audioUrl || undefined,
        notes: formData.notes || undefined,
        preachedAt: new Date(formData.preachedAt).toISOString(),
      };

      await createSermon(payload, token);
      
      setFormData({
        title: "",
        speaker: "",
        topic: "",
        scripture: "",
        description: "",
        videoUrl: "",
        audioUrl: "",
        notes: "",
        preachedAt: new Date().toISOString().split("T")[0],
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create sermon");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="sermons-modal-overlay" onClick={onClose}>
      <div className="sermons-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sermons-modal-header">
          <h3>Create New Sermon</h3>
          <button onClick={onClose} className="sermons-modal-close">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="sermons-modal-form">
          <div className="sermons-form-row">
            <div className="sermons-form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Sermon title"
                required
              />
            </div>
            <div className="sermons-form-group">
              <label>Speaker *</label>
              <input
                type="text"
                name="speaker"
                value={formData.speaker}
                onChange={handleChange}
                placeholder="Speaker name"
                required
              />
            </div>
          </div>

          <div className="sermons-form-row">
            <div className="sermons-form-group">
              <label>Topic</label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="e.g., Faith, Love, Grace"
              />
            </div>
            <div className="sermons-form-group">
              <label>Scripture</label>
              <input
                type="text"
                name="scripture"
                value={formData.scripture}
                onChange={handleChange}
                placeholder="e.g., Hebrews 11:1"
              />
            </div>
          </div>

          <div className="sermons-form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              placeholder="Brief description of the sermon"
            />
          </div>

          <div className="sermons-media-section">
            <p className="sermons-media-label">Media Files</p>

            <div className="sermons-media-upload">
              <div className="sermons-form-group">
                <label>Video</label>
                <div className="sermons-file-upload-wrapper">
                  <input
                    type="file"
                    accept="video/*"
                    ref={videoInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, "video");
                    }}
                    disabled={uploadingVideo}
                    className="sermons-file-input"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="sermons-file-label">
                    <FiUpload size={16} />
                    {uploadingVideo ? "Uploading..." : "Upload Video"}
                  </label>
                </div>
                {formData.videoUrl && (
                  <div className="sermons-file-preview">
                    <FiVideo size={16} />
                    <span>Video uploaded</span>
                    <button type="button" onClick={removeVideo} className="sermons-remove-file">
                      <FiX size={16} />
                    </button>
                  </div>
                )}
                <input
                  type="url"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  placeholder="Or enter video URL"
                  className="sermons-url-input"
                />
              </div>

              <div className="sermons-form-group">
                <label>Audio</label>
                <div className="sermons-file-upload-wrapper">
                  <input
                    type="file"
                    accept="audio/*"
                    ref={audioInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, "audio");
                    }}
                    disabled={uploadingAudio}
                    className="sermons-file-input"
                    id="audio-upload"
                  />
                  <label htmlFor="audio-upload" className="sermons-file-label">
                    <FiUpload size={16} />
                    {uploadingAudio ? "Uploading..." : "Upload Audio"}
                  </label>
                </div>
                {formData.audioUrl && (
                  <div className="sermons-file-preview">
                    <FiMusic size={16} />
                    <span>Audio uploaded</span>
                    <button type="button" onClick={removeAudio} className="sermons-remove-file">
                      <FiX size={16} />
                    </button>
                  </div>
                )}
                <input
                  type="url"
                  name="audioUrl"
                  value={formData.audioUrl}
                  onChange={handleChange}
                  placeholder="Or enter audio URL"
                  className="sermons-url-input"
                />
              </div>
            </div>
            <p className="sermons-media-hint">You can upload a file or enter a URL. Uploaded files take priority.</p>
          </div>

          <div className="sermons-form-row">
            <div className="sermons-form-group">
              <label>Preached Date *</label>
              <input
                type="date"
                name="preachedAt"
                value={formData.preachedAt}
                onChange={handleChange}
                required
              />
            </div>
            <div className="sermons-form-group">
              <label>Notes</label>
              <input
                type="text"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes"
              />
            </div>
          </div>

          {error && <div className="sermons-form-error">{error}</div>}

          <div className="sermons-modal-actions">
            <button type="button" onClick={onClose} className="sermons-modal-cancel">
              Cancel
            </button>
            <button type="submit" className="sermons-modal-submit" disabled={submitting || uploadingVideo || uploadingAudio}>
              {submitting ? "Creating..." : "Create Sermon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}