import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';

export default function BookDetailsPage() {
  const { id } = useParams();
  const { session } = useAuth();
  const { books, reviews, addToShelf, submitReview } = useLibrary();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const book = books.find((b) => b.id === id);
  const approved = useMemo(() => reviews.filter((r) => r.bookId === id && r.status === 'approved'), [reviews, id]);

  if (!book) return <p>Book not found.</p>;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="card md:col-span-2">
        <img src={book.cover} alt={book.title} className="mb-3 h-64 w-full rounded-xl object-cover" />
        <h1 className="text-2xl font-bold">{book.title}</h1>
        <p className="text-slate-400">{book.author} • {book.genre}</p>
        <p className="mt-2">{book.description}</p>
        <div className="mt-4 flex gap-2">
          <button className="btn-primary" onClick={() => addToShelf(session.user.id, id, 'want')}>Want to Read</button>
          <button className="btn-muted" onClick={() => addToShelf(session.user.id, id, 'reading')}>Currently Reading</button>
          <button className="btn-muted" onClick={() => addToShelf(session.user.id, id, 'read')}>Read</button>
        </div>
      </div>
      <div className="card">
        <h2 className="font-semibold">Submit Review</h2>
        <select className="input mt-2" value={rating} onChange={(e) => setRating(e.target.value)}>{[1,2,3,4,5].map((n) => <option key={n}>{n}</option>)}</select>
        <textarea className="input mt-2" rows="4" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your thoughts" />
        <button className="btn-primary mt-2 w-full" onClick={() => { submitReview({ userId: session.user.id, userName: session.user.name, bookId: id, rating, comment }); setComment(''); }}>Submit (pending)</button>
      </div>
      <div className="card md:col-span-3">
        <h2 className="mb-3 font-semibold">Approved Reviews</h2>
        {approved.map((r) => <div key={r.id} className="mb-2 rounded-lg border border-slate-700 p-2"><p className="text-sm text-amber-300">{r.userName} • ⭐ {r.rating}</p><p>{r.comment}</p></div>)}
        {!approved.length && <p className="text-sm text-slate-400">No approved reviews yet.</p>}
      </div>
    </div>
  );
}
