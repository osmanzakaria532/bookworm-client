import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { session, logout } = useAuth();
  const nav = session?.user?.role === 'admin'
    ? [
        ['Dashboard', '/admin/dashboard'],
        ['Books', '/admin/books'],
        ['Reviews', '/admin/reviews'],
        ['Tutorials', '/admin/tutorials'],
      ]
    : [
        ['My Library', '/my-library'],
        ['Browse', '/browse'],
        ['Recommendations', '/recommendations'],
        ['Tutorials', '/tutorials'],
      ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <header className="border-b border-slate-800 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to={session.user.role === 'admin' ? '/admin/dashboard' : '/my-library'} className="text-xl font-bold text-amber-400">📚 BookWorm</Link>
          <nav className="flex gap-2">
            {nav.map(([label, path]) => (
              <NavLink key={path} to={path} className={({ isActive }) => `rounded-lg px-3 py-1 text-sm ${isActive ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'}`}>{label}</NavLink>
            ))}
          </nav>
          <button className="btn-muted" onClick={logout}>Logout</button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
