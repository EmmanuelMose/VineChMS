import { useState, useEffect } from "react";
import { FiX, FiPlus, FiEdit2, FiTrash2, FiArrowLeft } from "react-icons/fi";
import { fetchExpenseCategories, createExpenseCategory, updateExpenseCategory, deleteExpenseCategory, type ExpenseCategory } from "../../../../Features/expenses/expensesAPI";
import "./ExpenseCategories.css";

interface ExpenseCategoriesProps {
  onBack: () => void;
  token: string;
  churchId: number;
}

export default function ExpenseCategories({ onBack, token, churchId }: ExpenseCategoriesProps) {
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<ExpenseCategory | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
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
      const data = await fetchExpenseCategories(token);
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
        await updateExpenseCategory(editing.categoryId, {
          name: formData.name,
          description: formData.description,
          image: formData.image || undefined,
        }, token);
      } else {
        await createExpenseCategory({
          churchId: churchId,
          name: formData.name,
          description: formData.description,
          image: formData.image || undefined,
        }, token);
      }
      setShowModal(false);
      setEditing(null);
      setFormData({ name: "", description: "", image: "" });
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
        await deleteExpenseCategory(id, token);
        await loadCategories();
      } catch (error) {
        console.error("Failed to delete category:", error);
      }
    }
  };

  const handleEdit = (category: ExpenseCategory) => {
    setEditing(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      image: category.image || "",
    });
    setShowModal(true);
  };

  if (loading) {
    return <div className="expense-categories-loading">Loading categories...</div>;
  }

  return (
    <div className="expense-categories-page">
      <div className="expense-categories-header">
        <button onClick={onBack} className="expense-categories-back-btn">
          <FiArrowLeft size={18} />
          Back
        </button>
        <h2 className="expense-categories-title">Expense Categories</h2>
        <button onClick={() => { setEditing(null); setFormData({ name: "", description: "", image: "" }); setShowModal(true); }} className="expense-categories-add-btn">
          <FiPlus size={16} />
          Add Category
        </button>
      </div>

      <div className="expense-categories-grid">
        {categories.map((category) => (
          <div key={category.categoryId} className="expense-categories-card">
            {category.image && (
              <div className="expense-categories-card-image">
                <img src={category.image} alt={category.name} />
              </div>
            )}
            <div className="expense-categories-card-content">
              <h3>{category.name}</h3>
              {category.description && (
                <p className="expense-categories-card-description">{category.description}</p>
              )}
              <div className="expense-categories-card-actions">
                <button onClick={() => handleEdit(category)} className="expense-categories-card-btn edit">
                  <FiEdit2 size={14} />
                </button>
                <button onClick={() => handleDelete(category.categoryId)} className="expense-categories-card-btn delete">
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="expense-categories-empty">No categories found</div>
        )}
      </div>

      {showModal && (
        <div className="expense-categories-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="expense-categories-modal" onClick={(e) => e.stopPropagation()}>
            <div className="expense-categories-modal-header">
              <h3>{editing ? "Edit Category" : "Add Category"}</h3>
              <button onClick={() => setShowModal(false)} className="expense-categories-modal-close">
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="expense-categories-modal-form">
              <div className="expense-categories-modal-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="expense-categories-modal-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="expense-categories-modal-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              {error && <div className="expense-categories-modal-error">{error}</div>}
              <div className="expense-categories-modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="expense-categories-modal-cancel">
                  Cancel
                </button>
                <button type="submit" className="expense-categories-modal-save" disabled={saving}>
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