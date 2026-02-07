import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';

const shelves = ['want', 'reading', 'read'];

export default function MyLibraryPage() {
  const { session } = useAuth();
  const { books, library, updateProgress } = useLibrary();
  const entries = library.filter((l) => l.userId === session.user.id);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Library</h1>
      {shelves.map((shelf) => (
        <section key={shelf} className="card">
          <h2 className="mb-3 text-lg font-semibold capitalize">{shelf === 'want' ? 'Want to Read' : shelf === 'reading' ? 'Currently Reading' : 'Read'}</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {entries.filter((e) => e.shelf === shelf).map((entry) => {
              const b = books.find((book) => book.id === entry.bookId);
              if (!b) return null;
              return (
                <div key={entry.id} className="rounded-xl border border-slate-700 p-3">
                  <Link to={`/book/${b.id}`} className="font-semibold text-amber-400">{b.title}</Link>
                  <p className="text-sm text-slate-400">{b.author}</p>
                  {shelf === 'reading' && (
                    <input className="input mt-2" type="number" min="0" max="100" value={entry.progress} onChange={(e) => updateProgress(entry.id, e.target.value)} />
                  )}
                </div>
              );
            })}
            {!entries.some((e) => e.shelf === shelf) && <p className="text-sm text-slate-400">No books yet.</p>}
          </div>
        </section>
      ))}
    </div>
  );
}
