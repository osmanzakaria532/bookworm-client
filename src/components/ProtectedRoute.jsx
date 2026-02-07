import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, role }) {
  const { session } = useAuth();
  if (!session?.token) return <Navigate to="/login" replace />;
  if (role && session.user.role !== role) return <Navigate to={session.user.role === 'admin' ? '/admin/dashboard' : '/my-library'} replace />;
  return children;
}
