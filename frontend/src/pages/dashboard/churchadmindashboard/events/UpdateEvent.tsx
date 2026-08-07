import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiX, FiPlus, FiTrash2 } from "react-icons/fi";
import { updateEvent, type Event } from "../../../../Features/events/eventsAPI";
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
    coverImageUrl: "",
  });
  const [gallery, setGallery] = useState<string[]>([]);
  const [galleryInput, setGalleryInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || "",
        location: event.location || "",
        startDate: event.startDate.slice(0, 16),
        endDate: event.endDate ? event.endDate.slice(0, 16) : "",
        status: event.status,
        isPublic: event.isPublic,
        maxAttendees: event.maxAttendees?.toString() || "",
        imageUrl: event.imageUrl || "",
        coverImageUrl: event.coverImageUrl || "",
      });
      setGallery(event.gallery || []);
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await updateEvent(event.eventId, {
        title: formData.title,
        description: formData.description || undefined,
        location: formData.location || undefined,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
        status: formData.status,
        isPublic: formData.isPublic,
        maxAttendees: formData.maxAttendees ? Number(formData.maxAttendees) : undefined,
        imageUrl: formData.imageUrl || undefined,
        coverImageUrl: formData.coverImageUrl || undefined,
        gallery: gallery.length > 0 ? gallery : undefined,
      }, token);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update event");
    } finally {
      setLoading(false);
    }
  };

  const addGalleryImage = () => {
    if (galleryInput && !gallery.includes(galleryInput)) {
      setGallery([...gallery, galleryInput]);
      setGalleryInput("");
    }
  };

  const removeGalleryImage = (url: string) => {
    setGallery(gallery.filter(g => g !== url));
  };

  if (!isOpen) return null;

  return (
    <div className="update-event-overlay" onClick={onClose}>
      <div className="update-event-modal" onClick={(e) => e.stopPropagation()}>
        <div className="update-event-header">
          <h3>Edit Event</h3>
          <button onClick={onClose} className="update-event-close">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="update-event-form">
          <div className="update-event-group">
            <label>Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="update-event-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>
          <div className="update-event-group">
            <label>Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
          <div className="update-event-row">
            <div className="update-event-group">
              <label>Start Date *</label>
              <input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="update-event-group">
              <label>End Date</label>
              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>
          <div className="update-event-row">
            <div className="update-event-group">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="update-event-group">
              <label>Max Attendees</label>
              <input
                type="number"
                value={formData.maxAttendees}
                onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
                placeholder="Unlimited"
                min="1"
              />
            </div>
          </div>
          <div className="update-event-checkbox">
            <label className="update-event-checkbox-label">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              />
              Public Event
            </label>
          </div>
          <div className="update-event-group">
            <label>Image URL</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
          </div>
          <div className="update-event-group">
            <label>Cover Image URL</label>
            <input
              type="url"
              value={formData.coverImageUrl}
              onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
            />
          </div>
          <div className="update-event-group">
            <label>Gallery Images</label>
            <div className="update-event-gallery-input">
              <input
                type="url"
                value={galleryInput}
                onChange={(e) => setGalleryInput(e.target.value)}
                placeholder="https://example.com/gallery.jpg"
              />
              <button type="button" onClick={addGalleryImage} className="update-event-gallery-add">
                <FiPlus size={16} />
              </button>
            </div>
            {gallery.length > 0 && (
              <div className="update-event-gallery-list">
                {gallery.map((url, index) => (
                  <div key={index} className="update-event-gallery-item">
                    <span>{url}</span>
                    <button type="button" onClick={() => removeGalleryImage(url)}>
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {error && <div className="update-event-error">{error}</div>}
          <div className="update-event-actions">
            <button type="button" onClick={onClose} className="update-event-cancel">
              Cancel
            </button>
            <button type="submit" className="update-event-save" disabled={loading}>
              {loading ? "Updating..." : "Update Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}