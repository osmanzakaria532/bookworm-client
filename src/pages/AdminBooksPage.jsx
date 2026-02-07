import { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { genres } from '../data/mockData';

export default function AdminBooksPage() {
  const { books, addBook, deleteBook } = useLibrary();
  const [form, setForm] = useState({ title: '', author: '', genre: genres[0], description: '', cover: '' });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Book Management</h1>
      <div className="card grid gap-2 md:grid-cols-2">
        <input className="input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="input" placeholder="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
        <select className="input" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })}>{genres.map((g)=><option key={g}>{g}</option>)}</select>
        <input className="input" placeholder="Cover image URL" value={form.cover} onChange={(e) => setForm({ ...form, cover: e.target.value })} />
        <textarea className="input md:col-span-2" rows="3" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button className="btn-primary md:col-span-2" onClick={() => addBook(form)}>Add Book</button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {books.map((b) => (
          <div key={b.id} className="card flex justify-between">
            <div><p className="font-semibold">{b.title}</p><p className="text-sm text-slate-400">{b.author}</p></div>
            <button className="btn-muted" onClick={() => deleteBook(b.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
