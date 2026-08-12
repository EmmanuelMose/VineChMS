import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { FiX, FiUpload, FiVideo, FiMusic } from "react-icons/fi";
import { updateSermon, type Sermon } from "../../../../Features/sermons/sermonsAPI";
import { uploadFileToCloudinary } from "../../../../Features/cloudinary/cloudinaryAPI";
import "./UpdateSermon.css";

interface UpdateSermonProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  sermon: Sermon;
}

export default function UpdateSermon({ isOpen, onClose, onSuccess, sermon }: UpdateSermonProps) {
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
    preachedAt: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);

  useEffect(() => {
    if (sermon) {
      setFormData({
        title: sermon.title,
        speaker: sermon.speaker,
        topic: sermon.topic || "",
        scripture: sermon.scripture || "",
        description: sermon.description || "",
        videoUrl: sermon.videoUrl || "",
        audioUrl: sermon.audioUrl || "",
        notes: sermon.notes || "",
        preachedAt: sermon.preachedAt.split("T")[0],
      });
    }
  }, [sermon]);

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
      await updateSermon(sermon.sermonId, {
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
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update sermon");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="update-sermon-overlay" onClick={onClose}>
      <div className="update-sermon-modal" onClick={(e) => e.stopPropagation()}>
        <div className="update-sermon-header">
          <h3>Edit Sermon</h3>
          <button onClick={onClose} className="update-sermon-close">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="update-sermon-form">
          <div className="update-sermon-row">
            <div className="update-sermon-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="update-sermon-group">
              <label>Speaker *</label>
              <input
                type="text"
                name="speaker"
                value={formData.speaker}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="update-sermon-row">
            <div className="update-sermon-group">
              <label>Topic</label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
              />
            </div>
            <div className="update-sermon-group">
              <label>Scripture</label>
              <input
                type="text"
                name="scripture"
                value={formData.scripture}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="update-sermon-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="update-sermon-media-section">
            <p className="update-sermon-media-label">Media Files</p>

            <div className="update-sermon-media-upload">
              <div className="update-sermon-group">
                <label>Video</label>
                <div className="update-sermon-file-upload-wrapper">
                  <input
                    type="file"
                    accept="video/*"
                    ref={videoInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, "video");
                    }}
                    disabled={uploadingVideo}
                    className="update-sermon-file-input"
                    id="update-video-upload"
                  />
                  <label htmlFor="update-video-upload" className="update-sermon-file-label">
                    <FiUpload size={16} />
                    {uploadingVideo ? "Uploading..." : "Upload Video"}
                  </label>
                </div>
                {formData.videoUrl && (
                  <div className="update-sermon-file-preview">
                    <FiVideo size={16} />
                    <span>Video uploaded</span>
                    <button type="button" onClick={removeVideo} className="update-sermon-remove-file">
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
                  className="update-sermon-url-input"
                />
              </div>

              <div className="update-sermon-group">
                <label>Audio</label>
                <div className="update-sermon-file-upload-wrapper">
                  <input
                    type="file"
                    accept="audio/*"
                    ref={audioInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, "audio");
                    }}
                    disabled={uploadingAudio}
                    className="update-sermon-file-input"
                    id="update-audio-upload"
                  />
                  <label htmlFor="update-audio-upload" className="update-sermon-file-label">
                    <FiUpload size={16} />
                    {uploadingAudio ? "Uploading..." : "Upload Audio"}
                  </label>
                </div>
                {formData.audioUrl && (
                  <div className="update-sermon-file-preview">
                    <FiMusic size={16} />
                    <span>Audio uploaded</span>
                    <button type="button" onClick={removeAudio} className="update-sermon-remove-file">
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
                  className="update-sermon-url-input"
                />
              </div>
            </div>
            <p className="update-sermon-media-hint">You can upload a file or enter a URL. Uploaded files take priority.</p>
          </div>

          <div className="update-sermon-row">
            <div className="update-sermon-group">
              <label>Preached Date *</label>
              <input
                type="date"
                name="preachedAt"
                value={formData.preachedAt}
                onChange={handleChange}
                required
              />
            </div>
            <div className="update-sermon-group">
              <label>Notes</label>
              <input
                type="text"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && <div className="update-sermon-error">{error}</div>}
          
          <div className="update-sermon-actions">
            <button type="button" onClick={onClose} className="update-sermon-cancel">
              Cancel
            </button>
            <button type="submit" className="update-sermon-save" disabled={loading || uploadingVideo || uploadingAudio}>
              {loading ? "Updating..." : "Update Sermon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}