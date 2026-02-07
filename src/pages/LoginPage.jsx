import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login, users } = useAuth();
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    try {
      login(form);
      const user = users.find((u) => u.email.toLowerCase() === form.email.toLowerCase());
      navigate(user?.role === 'admin' ? '/admin/dashboard' : '/my-library');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={onSubmit} className="card w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-amber-400">Login to BookWorm</h1>
        {error && <p className="rounded bg-rose-900/40 p-2 text-sm text-rose-300">{error}</p>}
        <input className="input" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn-primary w-full">Login</button>
        <p className="text-sm text-slate-400">No account? <Link className="text-amber-400" to="/register">Register</Link></p>
        <p className="text-xs text-slate-500">Demo admin: admin@bookworm.app / Admin@1234</p>
      </form>
    </div>
  );
}
