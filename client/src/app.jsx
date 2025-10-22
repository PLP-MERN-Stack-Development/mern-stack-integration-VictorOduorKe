// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar, NotificationContainer } from './components/common';
import { Home, Blog, Login, Register } from './pages';
import PostDetail from './pages/Blog/PostDetail.jsx';
import PostForm from './pages/Blog/PostForm.jsx';
import CategoryList from './pages/Category/CategoryList.jsx';
import CategoryForm from './pages/Category/CategoryForm.jsx';

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <Router>
            <div className="app">
              <Navbar />
              <NotificationContainer />
              <main>
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
                  <Route path="*" element={<Home />} />
                </Routes>
              </main>
            </div>
          </Router>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;