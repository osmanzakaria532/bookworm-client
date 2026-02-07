import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';

export default function AdminDashboardPage() {
  const { users, updateRole } = useAuth();
  const { books, reviews } = useLibrary();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="card"><p className="text-sm text-slate-400">Total Users</p><p className="text-3xl font-bold">{users.length}</p></div>
        <div className="card"><p className="text-sm text-slate-400">Total Books</p><p className="text-3xl font-bold">{books.length}</p></div>
        <div className="card"><p className="text-sm text-slate-400">Pending Reviews</p><p className="text-3xl font-bold">{reviews.filter((r) => r.status === 'pending').length}</p></div>
      </div>
      <div className="card">
        <h2 className="mb-2 font-semibold">User Management</h2>
        {users.map((u) => (
          <div className="mb-2 flex items-center justify-between rounded-lg border border-slate-700 p-2" key={u.id}>
            <span>{u.name} ({u.email})</span>
            <select className="input max-w-40" value={u.role} onChange={(e) => updateRole(u.id, e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
