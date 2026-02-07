import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyLibraryPage from './pages/MyLibraryPage';
import BrowsePage from './pages/BrowsePage';
import BookDetailsPage from './pages/BookDetailsPage';
import RecommendationsPage from './pages/RecommendationsPage';
import TutorialsPage from './pages/TutorialsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminBooksPage from './pages/AdminBooksPage';
import AdminReviewsPage from './pages/AdminReviewsPage';
import AdminTutorialsPage from './pages/AdminTutorialsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/my-library" element={<ProtectedRoute><Layout><MyLibraryPage /></Layout></ProtectedRoute>} />
      <Route path="/browse" element={<ProtectedRoute><Layout><BrowsePage /></Layout></ProtectedRoute>} />
      <Route path="/book/:id" element={<ProtectedRoute><Layout><BookDetailsPage /></Layout></ProtectedRoute>} />
      <Route path="/recommendations" element={<ProtectedRoute><Layout><RecommendationsPage /></Layout></ProtectedRoute>} />
      <Route path="/tutorials" element={<ProtectedRoute><Layout><TutorialsPage /></Layout></ProtectedRoute>} />

      <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><Layout><AdminDashboardPage /></Layout></ProtectedRoute>} />
      <Route path="/admin/books" element={<ProtectedRoute role="admin"><Layout><AdminBooksPage /></Layout></ProtectedRoute>} />
      <Route path="/admin/reviews" element={<ProtectedRoute role="admin"><Layout><AdminReviewsPage /></Layout></ProtectedRoute>} />
      <Route path="/admin/tutorials" element={<ProtectedRoute role="admin"><Layout><AdminTutorialsPage /></Layout></ProtectedRoute>} />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
