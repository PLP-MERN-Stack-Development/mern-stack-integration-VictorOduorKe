import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api/api';
import { useNotification } from '../../context/NotificationContext.jsx';
import Button from '../../components/common/Button/Button';

const CategoryForm = ({ category, onClose }) => {
  const navigate = useNavigate();
  const { notify } = useNotification();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEditing = !!category;

  useEffect(() => {
    if (isEditing && category) {
      // For editing, category comes from props, which is already the direct object
      setFormData({ name: category.name, description: category.description });
    }
  }, [isEditing, category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    console.log("CategoryForm.jsx: Submitting formData:", formData); // Add this line for debugging

    try {
      if (isEditing) {
        const response = await api.categoryService.updateCategory(category._id, formData);
        console.log("CategoryForm.jsx: updateCategory response:", response);
        // The actual updated category object is at response.data.data
        notify("Category updated successfully!", "success");
      } else {
        const response = await api.categoryService.createCategory(formData);
        console.log("CategoryForm.jsx: createCategory response:", response);
        // The actual created category object is at response.data.data
        notify("Category created successfully!", "success");
      }
      // Conditionally call onClose or navigate based on whether onClose is provided
      if (onClose) {
        onClose(); // Close modal and refresh list
      } else {
        navigate('/categories'); // Navigate back to list if standalone
      }
    } catch (err) {
      console.error("CategoryForm.jsx: Error saving category", err);
      setError(err.message || 'An error occurred');
      notify(err.response?.data?.message || 'Failed to save category', "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-600 text-sm">Error: {error}</p>}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        ></textarea>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : (isEditing ? 'Update Category' : 'Create Category')}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
