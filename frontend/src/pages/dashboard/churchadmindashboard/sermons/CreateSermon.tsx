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
  churchId?: number;
}

export default function CreateSermon({ isOpen, onClose, onSuccess, churchId }: CreateSermonProps) {
  const token = useSelector((state: any) => state.user.token);
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
  const [loading, setLoading] = useState(false);
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
    setLoading(true);

    try {
      await createSermon({
        churchId: Number(churchId),
        title: formData.title,
        speaker: formData.speaker,
        topic: formData.topic || undefined,
        scripture: formData.scripture || undefined,
        description: formData.description || undefined,
        videoUrl: formData.videoUrl || undefined,
        audioUrl: formData.audioUrl || undefined,
        notes: formData.notes || undefined,
        preachedAt: formData.preachedAt,
      }, token);
      
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
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="create-sermon-overlay" onClick={onClose}>
      <div className="create-sermon-modal" onClick={(e) => e.stopPropagation()}>
        <div className="create-sermon-header">
          <h3>Add New Sermon</h3>
          <button onClick={onClose} className="create-sermon-close">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="create-sermon-form">
          <div className="create-sermon-row">
            <div className="create-sermon-group">
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
            <div className="create-sermon-group">
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

          <div className="create-sermon-row">
            <div className="create-sermon-group">
              <label>Topic</label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="Sermon topic"
              />
            </div>
            <div className="create-sermon-group">
              <label>Scripture</label>
              <input
                type="text"
                name="scripture"
                value={formData.scripture}
                onChange={handleChange}
                placeholder="e.g., John 3:16"
              />
            </div>
          </div>

          <div className="create-sermon-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Sermon description"
              rows={3}
            />
          </div>

          <div className="create-sermon-media-section">
            <p className="create-sermon-media-label">Media Files</p>

            <div className="create-sermon-media-upload">
              <div className="create-sermon-group">
                <label>Video</label>
                <div className="create-sermon-file-upload-wrapper">
                  <input
                    type="file"
                    accept="video/*"
                    ref={videoInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, "video");
                    }}
                    disabled={uploadingVideo}
                    className="create-sermon-file-input"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="create-sermon-file-label">
                    <FiUpload size={16} />
                    {uploadingVideo ? "Uploading..." : "Upload Video"}
                  </label>
                </div>
                {formData.videoUrl && (
                  <div className="create-sermon-file-preview">
                    <FiVideo size={16} />
                    <span>Video uploaded</span>
                    <button type="button" onClick={removeVideo} className="create-sermon-remove-file">
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
                  className="create-sermon-url-input"
                />
              </div>

              <div className="create-sermon-group">
                <label>Audio</label>
                <div className="create-sermon-file-upload-wrapper">
                  <input
                    type="file"
                    accept="audio/*"
                    ref={audioInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, "audio");
                    }}
                    disabled={uploadingAudio}
                    className="create-sermon-file-input"
                    id="audio-upload"
                  />
                  <label htmlFor="audio-upload" className="create-sermon-file-label">
                    <FiUpload size={16} />
                    {uploadingAudio ? "Uploading..." : "Upload Audio"}
                  </label>
                </div>
                {formData.audioUrl && (
                  <div className="create-sermon-file-preview">
                    <FiMusic size={16} />
                    <span>Audio uploaded</span>
                    <button type="button" onClick={removeAudio} className="create-sermon-remove-file">
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
                  className="create-sermon-url-input"
                />
              </div>
            </div>
            <p className="create-sermon-media-hint">You can upload a file or enter a URL. Uploaded files take priority.</p>
          </div>

          <div className="create-sermon-row">
            <div className="create-sermon-group">
              <label>Preached Date *</label>
              <input
                type="date"
                name="preachedAt"
                value={formData.preachedAt}
                onChange={handleChange}
                required
              />
            </div>
            <div className="create-sermon-group">
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

          {error && <div className="create-sermon-error">{error}</div>}
          
          <div className="create-sermon-actions">
            <button type="button" onClick={onClose} className="create-sermon-cancel">
              Cancel
            </button>
            <button type="submit" className="create-sermon-save" disabled={loading || uploadingVideo || uploadingAudio}>
              {loading ? "Creating..." : "Create Sermon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}