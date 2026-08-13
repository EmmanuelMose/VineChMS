// File: src/pages/dashboard/churchmemberdashboard/giving/MyGivingCategories.tsx

import { useState, useEffect } from "react";
import { FiX, FiPlus, FiEdit2, FiTrash2, FiArrowLeft } from "react-icons/fi";
import { fetchGivingCategories, createGivingCategory, updateGivingCategory, deleteGivingCategory, type GivingCategory } from "../../../../Features/giving/givingAPI";
import { hasPermission, type UserRole } from "../../../../utils/permissions";
import "./MyGivingCategories.css";

interface MyGivingCategoriesProps {
  onBack: () => void;
  token: string;
  churchId: number;
  userRole?: UserRole;
}

export default function MyGivingCategories({ onBack, token, churchId, userRole }: MyGivingCategoriesProps) {
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

  const canManageCategories = userRole ? hasPermission(userRole, "manage_giving_categories") : false;

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
    return <div className="member-categories-loading">Loading categories...</div>;
  }

  return (
    <div className="member-categories-page">
      <div className="member-categories-header">
        <button onClick={onBack} className="member-categories-back-btn">
          <FiArrowLeft size={18} />
          Back
        </button>
        <h2 className="member-categories-title">Giving Categories</h2>
        {canManageCategories && (
          <button onClick={() => { setEditing(null); setFormData({ name: "", description: "", type: "offering", image: "" }); setShowModal(true); }} className="member-categories-add-btn">
            <FiPlus size={16} />
            Add Category
          </button>
        )}
      </div>

      <div className="member-categories-grid">
        {categories.map((category) => (
          <div key={category.categoryId} className="member-categories-card">
            {category.image && (
              <div className="member-categories-card-image">
                <img src={category.image} alt={category.name} />
              </div>
            )}
            <div className="member-categories-card-content">
              <div className="member-categories-card-header">
                <h3>{category.name}</h3>
                <span className="member-categories-card-type">{category.type}</span>
              </div>
              {category.description && (
                <p className="member-categories-card-description">{category.description}</p>
              )}
              {canManageCategories && (
                <div className="member-categories-card-actions">
                  <button onClick={() => handleEdit(category)} className="member-categories-card-btn edit">
                    <FiEdit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(category.categoryId)} className="member-categories-card-btn delete">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="member-categories-empty">No categories found</div>
        )}
      </div>

      {showModal && canManageCategories && (
        <div className="member-categories-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="member-categories-modal" onClick={(e) => e.stopPropagation()}>
            <div className="member-categories-modal-header">
              <h3>{editing ? "Edit Category" : "Add Category"}</h3>
              <button onClick={() => setShowModal(false)} className="member-categories-modal-close">
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="member-categories-modal-form">
              <div className="member-categories-modal-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="member-categories-modal-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="member-categories-modal-group">
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
              <div className="member-categories-modal-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              {error && <div className="member-categories-modal-error">{error}</div>}
              <div className="member-categories-modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="member-categories-modal-cancel">
                  Cancel
                </button>
                <button type="submit" className="member-categories-modal-save" disabled={saving}>
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