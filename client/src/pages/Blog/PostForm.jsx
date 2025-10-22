import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api/api';
import { useNotification } from '../../context/NotificationContext.jsx';
import Button from '../../components/common/Button/Button';

const PostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notify } = useNotification();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    featuredImage: '',
    excerpt: '',
    category: '',
    tags: '',
    isPublished: false,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isEditing = !!id;

  // useEffect for fetching categories (runs once on mount)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.categoryService.getAllCategories();
        const apiCategories = response.data; // Corrected to access data directly
        const finalCategories = Array.isArray(apiCategories) ? apiCategories : [];
        setCategories(finalCategories);
      } catch (err) {
        notify("Failed to fetch categories", "error");
      }
    };
    fetchCategories();
  }, [notify]); // Dependency on notify is fine as it's stable from context

  // useEffect for fetching a single post (runs when id or isEditing changes)
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await api.postService.getPost(id);
        const postData = response.data; // Corrected to access data directly from response.data
        
        if (!postData) {
          notify("Post not found or you are not authorized to edit it.", "error");
          navigate('/blog');
          return;
        }

        setFormData({
          title: postData.title,
          content: postData.content,
          featuredImage: postData.featuredImage,
          excerpt: postData.excerpt,
          category: postData.category?._id || '',
          tags: postData.tags.join(', '),
          isPublished: postData.isPublished,
        });
      } catch (err) {
        notify("Failed to fetch post for editing", "error");
        setError(err.message || 'Failed to load post for editing'); // Set only the message or a default string
      } finally {
        setLoading(false);
      }
    };

    if (isEditing) {
      fetchPost();
    }
  }, [id, isEditing]); // Removed notify from dependencies

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const postData = {
      ...formData,
      tags: formData.tags.split(', ').map((tag) => tag.trim()).filter(Boolean),
    };

    console.log("PostForm.jsx: Submitting postData:", postData); // Debugging: log data before API call

    try {
      if (isEditing) {
        const response = await api.postService.updatePost(id, postData);
        notify("Post updated successfully!", "success");
      } else {
        const response = await api.postService.createPost(postData);
        notify("Post created successfully!", "success");
      }
      navigate('/blog');
    } catch (err) {
      setError(err.message || 'An error occurred');
      notify(err.response?.data?.message || 'Failed to save post', "error");
    } finally {
      setLoading(false);
    }
  };


  if (loading && isEditing) return <div className="text-center mt-8">Loading post for editing...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{isEditing ? 'Edit Post' : 'Create New Post'}</h1>
      {error && <p className="text-red-600 mb-4">Error: {error}</p>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">Content:</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="10"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="featuredImage" className="block text-gray-700 text-sm font-bold mb-2">Featured Image URL:</label>
          <input
            type="text"
            id="featuredImage"
            name="featuredImage"
            value={formData.featuredImage}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="excerpt" className="block text-gray-700 text-sm font-bold mb-2">Excerpt:</label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows="3"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            maxLength="200"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Category:</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Select a Category</option>
            {Array.isArray(categories) && categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="tags" className="block text-gray-700 text-sm font-bold mb-2">Tags (comma-separated):</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="isPublished"
            name="isPublished"
            checked={formData.isPublished}
            onChange={handleChange}
            className="mr-2 leading-tight"
          />
          <label htmlFor="isPublished" className="text-gray-700 text-sm font-bold">Publish Post</label>
        </div>
        <div className="flex items-center justify-between">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (isEditing ? 'Update Post' : 'Create Post')}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/blog')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
