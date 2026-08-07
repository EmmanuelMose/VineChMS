import { useState } from "react";
import { useSelector } from "react-redux";
import { FiX, FiPlus, FiTrash2 } from "react-icons/fi";
import { createEvent } from "../../../../Features/events/eventsAPI";
import "./CreateEvent.css";

interface CreateEventProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  churchId?: number;
}

export default function CreateEvent({ isOpen, onClose, onSuccess, churchId }: CreateEventProps) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createEvent({
        churchId: Number(churchId),
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
      
      setFormData({
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
      setGallery([]);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create event");
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
    <div className="create-event-overlay" onClick={onClose}>
      <div className="create-event-modal" onClick={(e) => e.stopPropagation()}>
        <div className="create-event-header">
          <h3>Create Event</h3>
          <button onClick={onClose} className="create-event-close">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="create-event-form">
          <div className="create-event-group">
            <label>Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter event title"
              required
            />
          </div>
          <div className="create-event-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter event description"
              rows={3}
            />
          </div>
          <div className="create-event-group">
            <label>Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Event location"
            />
          </div>
          <div className="create-event-row">
            <div className="create-event-group">
              <label>Start Date *</label>
              <input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="create-event-group">
              <label>End Date</label>
              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>
          <div className="create-event-row">
            <div className="create-event-group">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="create-event-group">
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
          <div className="create-event-checkbox">
            <label className="create-event-checkbox-label">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              />
              Public Event
            </label>
          </div>
          <div className="create-event-group">
            <label>Image URL</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="create-event-group">
            <label>Cover Image URL</label>
            <input
              type="url"
              value={formData.coverImageUrl}
              onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
              placeholder="https://example.com/cover.jpg"
            />
          </div>
          <div className="create-event-group">
            <label>Gallery Images</label>
            <div className="create-event-gallery-input">
              <input
                type="url"
                value={galleryInput}
                onChange={(e) => setGalleryInput(e.target.value)}
                placeholder="https://example.com/gallery.jpg"
              />
              <button type="button" onClick={addGalleryImage} className="create-event-gallery-add">
                <FiPlus size={16} />
              </button>
            </div>
            {gallery.length > 0 && (
              <div className="create-event-gallery-list">
                {gallery.map((url, index) => (
                  <div key={index} className="create-event-gallery-item">
                    <span>{url}</span>
                    <button type="button" onClick={() => removeGalleryImage(url)}>
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {error && <div className="create-event-error">{error}</div>}
          <div className="create-event-actions">
            <button type="button" onClick={onClose} className="create-event-cancel">
              Cancel
            </button>
            <button type="submit" className="create-event-save" disabled={loading}>
              {loading ? "Creating..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}