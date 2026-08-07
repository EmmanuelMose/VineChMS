import { useState, useEffect } from "react";
import { FiX, FiPlus, FiEdit2, FiTrash2, FiArrowLeft } from "react-icons/fi";
import { fetchGivingCategories, createGivingCategory, updateGivingCategory, deleteGivingCategory, type GivingCategory } from "../../../../Features/giving/givingAPI";
import "./GivingCategories.css";

interface GivingCategoriesProps {
  onBack: () => void;
  token: string;
  churchId: number;
}

export default function GivingCategories({ onBack, token, churchId }: GivingCategoriesProps) {
  const [categories, setCategories] = useState<GivingCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<GivingCategory | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "offering",
    image: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await fetchGivingCategories(token);
      const filtered = data.filter(c => c.churchId === churchId);
      setCategories(filtered);
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      if (editing) {
        await updateGivingCategory(editing.categoryId, {
          name: formData.name,
          description: formData.description,
          type: formData.type,
          image: formData.image || undefined,
        }, token);
      } else {
        await createGivingCategory({
          churchId: churchId,
          name: formData.name,
          description: formData.description,
          type: formData.type,
          image: formData.image || undefined,
        }, token);
      }
      setShowModal(false);
      setEditing(null);
      setFormData({ name: "", description: "", type: "offering", image: "" });
      await loadCategories();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteGivingCategory(id, token);
        await loadCategories();
      } catch (error) {
        console.error("Failed to delete category:", error);
      }
    }
  };

  const handleEdit = (category: GivingCategory) => {
    setEditing(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      type: category.type,
      image: category.image || "",
    });
    setShowModal(true);
  };

  if (loading) {
    return <div className="categories-loading">Loading categories...</div>;
  }

  return (
    <div className="categories-page">
      <div className="categories-header">
        <button onClick={onBack} className="categories-back-btn">
          <FiArrowLeft size={18} />
          Back
        </button>
        <h2 className="categories-title">Giving Categories</h2>
        <button onClick={() => { setEditing(null); setFormData({ name: "", description: "", type: "offering", image: "" }); setShowModal(true); }} className="categories-add-btn">
          <FiPlus size={16} />
          Add Category
        </button>
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <div key={category.categoryId} className="categories-card">
            {category.image && (
              <div className="categories-card-image">
                <img src={category.image} alt={category.name} />
              </div>
            )}
            <div className="categories-card-content">
              <div className="categories-card-header">
                <h3>{category.name}</h3>
                <span className="categories-card-type">{category.type}</span>
              </div>
              {category.description && (
                <p className="categories-card-description">{category.description}</p>
              )}
              <div className="categories-card-actions">
                <button onClick={() => handleEdit(category)} className="categories-card-btn edit">
                  <FiEdit2 size={14} />
                </button>
                <button onClick={() => handleDelete(category.categoryId)} className="categories-card-btn delete">
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="categories-empty">No categories found</div>
        )}
      </div>

      {showModal && (
        <div className="categories-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="categories-modal" onClick={(e) => e.stopPropagation()}>
            <div className="categories-modal-header">
              <h3>{editing ? "Edit Category" : "Add Category"}</h3>
              <button onClick={() => setShowModal(false)} className="categories-modal-close">
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="categories-modal-form">
              <div className="categories-modal-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="categories-modal-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="categories-modal-group">
                <label>Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                >
                  <option value="tithe">Tithe</option>
                  <option value="offering">Offering</option>
                  <option value="donation">Donation</option>
                  <option value="special">Special</option>
                  <option value="pledge">Pledge</option>
                </select>
              </div>
              <div className="categories-modal-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              {error && <div className="categories-modal-error">{error}</div>}
              <div className="categories-modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="categories-modal-cancel">
                  Cancel
                </button>
                <button type="submit" className="categories-modal-save" disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}