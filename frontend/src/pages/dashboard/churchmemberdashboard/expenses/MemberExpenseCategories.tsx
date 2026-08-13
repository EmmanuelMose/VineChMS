
import { useState, useEffect } from "react";
import { FiX, FiPlus, FiEdit2, FiTrash2, FiArrowLeft } from "react-icons/fi";
import { fetchExpenseCategories, createExpenseCategory, updateExpenseCategory, deleteExpenseCategory, type ExpenseCategory } from "../../../../Features/expenses/expensesAPI";
import { hasPermission, type UserRole } from "../../../../utils/permissions";
import "./MemberExpenseCategories.css";

interface MemberExpenseCategoriesProps {
  onBack: () => void;
  token: string;
  churchId: number;
  userRole?: UserRole;
}

export default function MemberExpenseCategories({ onBack, token, churchId, userRole }: MemberExpenseCategoriesProps) {
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

  const canManageCategories = userRole ? hasPermission(userRole, "manage_expense_categories") : false;

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
    return <div className="member-expense-categories-loading">Loading categories...</div>;
  }

  return (
    <div className="member-expense-categories-page">
      <div className="member-expense-categories-header">
        <button onClick={onBack} className="member-expense-categories-back-btn">
          <FiArrowLeft size={18} />
          Back
        </button>
        <h2 className="member-expense-categories-title">Expense Categories</h2>
        {canManageCategories && (
          <button onClick={() => { setEditing(null); setFormData({ name: "", description: "", image: "" }); setShowModal(true); }} className="member-expense-categories-add-btn">
            <FiPlus size={16} />
            Add Category
          </button>
        )}
      </div>

      <div className="member-expense-categories-grid">
        {categories.map((category) => (
          <div key={category.categoryId} className="member-expense-categories-card">
            {category.image && (
              <div className="member-expense-categories-card-image">
                <img src={category.image} alt={category.name} />
              </div>
            )}
            <div className="member-expense-categories-card-content">
              <h3>{category.name}</h3>
              {category.description && (
                <p className="member-expense-categories-card-description">{category.description}</p>
              )}
              {canManageCategories && (
                <div className="member-expense-categories-card-actions">
                  <button onClick={() => handleEdit(category)} className="member-expense-categories-card-btn edit">
                    <FiEdit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(category.categoryId)} className="member-expense-categories-card-btn delete">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="member-expense-categories-empty">No categories found</div>
        )}
      </div>

      {showModal && canManageCategories && (
        <div className="member-expense-categories-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="member-expense-categories-modal" onClick={(e) => e.stopPropagation()}>
            <div className="member-expense-categories-modal-header">
              <h3>{editing ? "Edit Category" : "Add Category"}</h3>
              <button onClick={() => setShowModal(false)} className="member-expense-categories-modal-close">
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="member-expense-categories-modal-form">
              <div className="member-expense-categories-modal-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="member-expense-categories-modal-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="member-expense-categories-modal-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              {error && <div className="member-expense-categories-modal-error">{error}</div>}
              <div className="member-expense-categories-modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="member-expense-categories-modal-cancel">
                  Cancel
                </button>
                <button type="submit" className="member-expense-categories-modal-save" disabled={saving}>
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