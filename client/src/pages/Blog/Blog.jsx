// pages/Blog/Blog.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api/api';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../context/NotificationContext.jsx';
import Button from '../../components/common/Button/Button';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();
  const { notify } = useNotification();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await api.postService.getAllPosts();
      const apiPosts = response.data; // Corrected to access data directly
      const finalPosts = Array.isArray(apiPosts) ? apiPosts : [];
      setPosts(finalPosts);
    } catch (err) {
      console.error("Blog.jsx: Error fetching posts", err);
      setError(err);
      notify("Failed to fetch posts", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await api.postService.deletePost(id);
        notify("Post deleted successfully", "success");
        fetchPosts(); // Re-fetch posts after deletion
      } catch (err) {
        notify(err.response?.data?.message || 'Failed to delete post', "error");
      }
    }
  };

  if (loading) return <div className="text-center mt-8">Loading posts...</div>;
  if (error) return <div className="text-center mt-8 text-red-600">Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        {isAuthenticated && (
          <Link to="/posts/new">
            <Button>Create New Post</Button>
          </Link>
        )}
      </div>

      {loading ? (
        <div className="text-center mt-8">Loading posts...</div>
      ) : Array.isArray(posts) && posts.length === 0 ? (
        <p className="text-center text-gray-600">No posts found. Create one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(posts) && posts.map(post => {
            const canModifyPost = isAuthenticated && user && (user._id === post.author._id || user.role === 'admin');
            return (
              <div key={post._id} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-4">By {post.author?.username || 'Anonymous'}</p>
                <p className="text-gray-700 mb-4">{post.excerpt}</p>
                <Link to={`/posts/${post.slug}`} className="text-indigo-600 hover:underline mr-4">Read More</Link>
                {canModifyPost && (
                  <>
                    <Link to={`/posts/${post.slug}/edit`} className="text-blue-600 hover:underline mr-4">Edit</Link>
                    <Button variant="danger" onClick={() => handleDelete(post._id)} className="text-sm">Delete</Button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Blog;