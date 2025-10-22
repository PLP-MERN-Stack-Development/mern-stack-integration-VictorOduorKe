import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api/api';
import { useNotification } from '../../context/NotificationContext.jsx';
import Button from '../../components/common/Button/Button';
import Modal from '../../components/common/Modal/Modal';
import CategoryForm from './CategoryForm.jsx';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { notify } = useNotification();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.categoryService.getAllCategories();
      const apiCategories = response.data; // Corrected to access data directly
      const finalCategories = Array.isArray(apiCategories) ? apiCategories : [];
      setCategories(finalCategories);
    } catch (err) {
      console.error("CategoryList.jsx: Error fetching categories", err);
      setError(err);
      notify("Failed to fetch categories", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await api.categoryService.deleteCategory(id);
        notify("Category deleted successfully", "success");
        fetchCategories(); // Re-fetch categories after deletion
      } catch (err) {
        notify(err.response?.data?.message || 'Failed to delete category', "error");
      }
    }
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    fetchCategories(); // Refresh list after modal close (if changes were made)
  };

  if (loading) return <div className="text-center mt-8">Loading categories...</div>;
  if (error) return <div className="text-center mt-8 text-red-600">Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Categories</h1>
      <div className="flex justify-end mb-4">
        <Link to="/categories/new">
          <Button>Create New Category</Button>
        </Link>
      </div>

      {Array.isArray(categories) && categories.length === 0 ? (
        <p className="text-center text-gray-600">No categories found. Create one!</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(categories) && categories.map((category) => (
                <tr key={category._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{category.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button variant="secondary" onClick={() => openEditModal(category)} className="mr-2">Edit</Button>
                    <Button variant="danger" onClick={() => handleDelete(category._id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedCategory ? 'Edit Category' : 'Create Category'}>
        <CategoryForm category={selectedCategory} onClose={closeModal} />
      </Modal>
    </div>
  );
};

export default CategoryList;
