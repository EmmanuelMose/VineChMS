import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { updateEvent, type Event } from "../../../../Features/events/eventsAPI";
import { uploadFileToCloudinary } from "../../../../Features/cloudinary/cloudinaryAPI";
import { FiX, FiUpload } from "react-icons/fi";
import "./UpdateEvent.css";

interface UpdateEventProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  event: Event;
}

export default function UpdateEvent({ isOpen, onClose, onSuccess, event }: UpdateEventProps) {
  const token = useSelector((state: any) => state.user.token);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    status: "draft",
    isPublic: true,
    maxAttendees: "",
    imageUrl: "",
    imagePublicId: "",
    coverImageUrl: "",
    coverImagePublicId: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || "",
        location: event.location || "",
        startDate: new Date(event.startDate).toISOString().split("T")[0],
        endDate: event.endDate ? new Date(event.endDate).toISOString().split("T")[0] : "",
        status: event.status || "draft",
        isPublic: event.isPublic !== undefined ? event.isPublic : true,
        maxAttendees: event.maxAttendees ? event.maxAttendees.toString() : "",
        imageUrl: event.imageUrl || "",
        imagePublicId: event.imagePublicId || "",
        coverImageUrl: event.coverImageUrl || "",
        coverImagePublicId: event.coverImagePublicId || "",
      });
    }
  }, [event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const handleFileUpload = async (file: File, type: "image" | "cover") => {
    if (!file) return;
    const setUploading = type === "image" ? setUploadingImage : setUploadingCover;
    setUploading(true);
    try {
      const result = await uploadFileToCloudinary(file, token, "vinechms/events", {
        resourceType: "image",
        quality: 80,
      });
      if (type === "image") {
        setFormData((prev) => ({
          ...prev,
          imageUrl: result.secureUrl,
          imagePublicId: result.publicId,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          coverImageUrl: result.secureUrl,
          coverImagePublicId: result.publicId,
        }));
      }
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError(err.message || "Image upload failed");
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
        location: formData.location || undefined,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
        status: formData.status,
        isPublic: formData.isPublic,
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : undefined,
        imageUrl: formData.imageUrl || undefined,
        imagePublicId: formData.imagePublicId || undefined,
        coverImageUrl: formData.coverImageUrl || undefined,
        coverImagePublicId: formData.coverImagePublicId || undefined,
      };

      await updateEvent(event.eventId, payload, token);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update event");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="member-events-modal-overlay" onClick={onClose}>
      <div className="member-events-modal" onClick={(e) => e.stopPropagation()}>
        <div className="member-events-modal-header">
          <h3>Edit Event</h3>
          <button onClick={onClose} className="member-events-modal-close">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="member-events-modal-form">
          <div className="member-events-form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="member-events-form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="member-events-form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className="member-events-form-row">
            <div className="member-events-form-group">
              <label>Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="member-events-form-group">
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="member-events-form-row">
            <div className="member-events-form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="member-events-form-group">
              <label>Max Attendees</label>
              <input
                type="number"
                name="maxAttendees"
                value={formData.maxAttendees}
                onChange={handleChange}
                placeholder="Unlimited"
              />
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="member-events-form-row">
            <div className="member-events-form-group">
              <label>Event Poster (Image)</label>
              <div className="member-events-file-upload-wrapper">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, "image");
                  }}
                  disabled={uploadingImage}
                  className="member-events-file-input"
                  id="update-event-image"
                />
                <label htmlFor="update-event-image" className="member-events-file-label">
                  <FiUpload /> {uploadingImage ? "Uploading..." : "Change Image"}
                </label>
              </div>
              {formData.imageUrl && (
                <div className="member-events-image-preview">
                  <img src={formData.imageUrl} alt="Event poster" />
                  <button
                    type="button"
                    className="member-events-remove-image"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, imageUrl: "", imagePublicId: "" }));
                    }}
                  >
                    <FiX size={16} />
                  </button>
                </div>
              )}
            </div>
            <div className="member-events-form-group">
              <label>Cover Image</label>
              <div className="member-events-file-upload-wrapper">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, "cover");
                  }}
                  disabled={uploadingCover}
                  className="member-events-file-input"
                  id="update-event-cover"
                />
                <label htmlFor="update-event-cover" className="member-events-file-label">
                  <FiUpload /> {uploadingCover ? "Uploading..." : "Change Cover"}
                </label>
              </div>
              {formData.coverImageUrl && (
                <div className="member-events-image-preview">
                  <img src={formData.coverImageUrl} alt="Event cover" />
                  <button
                    type="button"
                    className="member-events-remove-image"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, coverImageUrl: "", coverImagePublicId: "" }));
                    }}
                  >
                    <FiX size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="member-events-form-group">
            <div className="member-events-checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleCheckboxChange}
                />
                Public Event
              </label>
            </div>
          </div>

          {error && <div className="member-events-form-error">{error}</div>}

          <div className="member-events-modal-actions">
            <button type="button" onClick={onClose} className="member-events-modal-cancel">
              Cancel
            </button>
            <button
              type="submit"
              className="member-events-modal-submit"
              disabled={submitting || uploadingImage || uploadingCover}
            >
              {submitting ? "Updating..." : "Update Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}