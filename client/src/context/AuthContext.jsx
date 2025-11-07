import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api/api';
import { useNotification } from './NotificationContext.jsx';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { notify } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await api.authService.getProfile();
          setUser(response.data); // Assuming response.data is the user object
        }
      } catch (error) {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.authService.login(email, password);
      localStorage.setItem('token', response.token);
      setUser(response); // Corrected from response.data to response
      notify("Logged in successfully!", "success");
      navigate('/blog');
      return response;
    } catch (error) {
      console.error("AuthContext: Login failed", error);
      notify(error.response?.data?.message || 'Login failed', "error");
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.authService.register(userData);
      console.log("AuthContext: Register response:", response);
      localStorage.setItem('token', response.token);
      setUser(response); // Corrected from response.data to response
      notify("Account created successfully!", "success");
      navigate('/blog');
      return response;
    } catch (error) {
      notify(error.response?.data?.message || 'Registration failed', "error");
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    notify("Logged out successfully.", "info");
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
