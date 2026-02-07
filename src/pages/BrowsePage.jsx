import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { genres } from '../data/mockData';

export default function BrowsePage() {
  const { books } = useLibrary();
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState([]);
  const [sort, setSort] = useState('rating');

  const filtered = books
    .filter((b) => `${b.title} ${b.author}`.toLowerCase().includes(q.toLowerCase()))
    .filter((b) => !selected.length || selected.includes(b.genre))
    .sort((a, b) => (sort === 'rating' ? b.rating - a.rating : b.shelved - a.shelved));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Browse Books</h1>
      <div className="card grid gap-3 md:grid-cols-3">
        <input className="input" placeholder="Search by title/author" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="rating">Sort: Rating</option>
          <option value="shelved">Sort: Most Shelved</option>
        </select>
        <select className="input" onChange={(e) => setSelected(Array.from(e.target.selectedOptions, (o) => o.value))} multiple>
          {genres.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {filtered.map((b) => (
          <Link key={b.id} to={`/book/${b.id}`} className="card block hover:border-amber-400/60">
            <img src={b.cover} alt={b.title} className="mb-2 h-40 w-full rounded-lg object-cover" />
            <p className="font-semibold">{b.title}</p>
            <p className="text-sm text-slate-400">{b.author} • {b.genre}</p>
            <p className="text-sm text-amber-300">⭐ {b.rating}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
