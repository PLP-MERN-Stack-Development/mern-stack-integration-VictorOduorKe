import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Added useNavigate
import api from '../../services/api/api';
import { useNotification } from '../../context/NotificationContext.jsx';
import Button from '../../components/common/Button/Button.jsx'; // Corrected Button import
import { useAuth } from '../../hooks/useAuth'; // Added useAuth import

const PostDetail = () => {
  const { slug } = useParams(); // Changed from id to slug
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { notify } = useNotification();
  const [newComment, setNewComment] = useState(''); // Added state for new comment
  const { isAuthenticated, user } = useAuth(); // Used isAuthenticated from useAuth
  const navigate = useNavigate(); // Initialized useNavigate

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.postService.getPost(slug);
        const apiPost = response.data; // Assuming post is nested under data
        setPost(apiPost);
      } catch (err) {
        console.error("PostDetail.jsx: Error fetching post", err);
        setError(err);
        notify("Failed to fetch post", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug, notify]); // Dependency on slug

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      notify("Please log in to add a comment.", "warning");
      return;
    }
    if (!newComment.trim()) {
      notify("Comment cannot be empty.", "warning");
      return;
    }

    try {
      await api.commentService.addComment(post._id, { content: newComment });
      setNewComment('');
      notify("Comment added successfully!", "success");
      // Re-fetch the post to update comments
      const response = await api.postService.getPost(post.slug);
      setPost(response.data);
    } catch (err) {
      console.error("PostDetail.jsx: Error adding comment", err);
      notify(err.response?.data?.message || 'Failed to add comment', "error");
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await api.postService.deletePost(post._id);
        notify("Post deleted successfully", "success");
        navigate('/blog'); // Redirect to blog page after deletion
      } catch (err) {
        notify(err.response?.data?.message || 'Failed to delete post', "error");
      }
    }
  };

  if (loading) return <div className="text-center mt-8">Loading post...</div>;
  if (error) return <div className="text-center mt-8 text-red-600">Error: {error.message}</div>;
  if (!post) return <div className="text-center mt-8 text-gray-600">Post not found.</div>;

  const canModifyPost = isAuthenticated && user && (user._id === post.author._id || user.role === 'admin');


  return (
    <div className="container mx-auto p-4">
      <article className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        {post.featuredImage && (
          <img src={post.featuredImage} alt={post.title} className="w-full h-64 object-cover rounded-md mb-4" />
        )}
        <p className="text-gray-600 text-sm mb-2">By {post.author?.username} on {new Date(post.createdAt).toLocaleDateString()}</p>
        <p className="text-gray-800 leading-relaxed">{post.content}</p>
        {post.category && (
          <p className="text-sm text-indigo-600 mt-4">Category: {post.category.name}</p>
        )}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-2">
            {post.tags.map(tag => (
              <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">#{tag}</span>
            ))}
          </div>
        )}

        {/* Edit and Delete Post Buttons */}
        {canModifyPost && (
          <div className="mt-4 flex space-x-2">
            <Button onClick={() => navigate(`/posts/${post._id}/edit`)}>Edit Post</Button>
            <Button variant="danger" onClick={handleDeletePost}>Delete Post</Button>
          </div>
        )}

        <h3 className="text-xl font-bold mt-8 mb-4">Comments</h3>
        {post.comments && post.comments.length > 0 ? (
          <div>
            {post.comments.map((comment, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-md mb-3">
                <p className="font-semibold">{comment.user?.username || 'Anonymous'}</p>
                <p className="text-gray-700">{comment.content}</p>
                <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}

        {isAuthenticated && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Add a Comment</h3>
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <div>
                <label htmlFor="commentContent" className="block text-sm font-medium text-gray-700">Your Comment</label>
                <textarea
                  id="commentContent"
                  name="commentContent"
                  rows="4"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                  placeholder="Write your comment here..."
                  required
                ></textarea>
              </div>
              <Button type="submit">Submit Comment</Button>
            </form>
          </div>
        )}
      </article>
    </div>
  );
};

export default PostDetail;
