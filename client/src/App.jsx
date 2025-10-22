import React from 'react'
import Home from './pages/Home/Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Blog from './pages/Blog/Blog'
import NavBar from './components/common/NavBar/NavBar'
import { AuthProvider } from './context/AuthContext.jsx'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import PostDetail from './pages/Blog/PostDetail'
import PostForm from './pages/Blog/PostForm'
import CategoryList from './pages/Category/CategoryList'
import CategoryForm from './pages/Category/CategoryForm'
import NotificationDisplay from './components/common/NotificationDisplay/NotificationDisplay';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NavBar />
        <main className="flex-grow container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/posts/:slug" element={<PostDetail />} />
            <Route path="/posts/new" element={<PostForm />} />
            <Route path="/posts/:id/edit" element={<PostForm />} />
            <Route path="/categories" element={<CategoryList />} />
            <Route path="/categories/new" element={<CategoryForm />} />
            {/* CategoryForm for editing is handled via modal in CategoryList, so no separate route needed */}
          </Routes>
        </main>
        <NotificationDisplay />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
