// client/src/services/api/commentService.js
import api from '../config/axiosConfig';

export const commentService = {
  addComment: async (postId, commentData) => {
    const response = await api.post(`/posts/${postId}/comments`, commentData);
    return response.data;
  },
};



