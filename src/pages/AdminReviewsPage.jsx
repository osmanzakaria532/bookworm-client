import { useLibrary } from '../context/LibraryContext';

export default function AdminReviewsPage() {
  const { reviews, reviewAction } = useLibrary();
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Review Moderation</h1>
      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="card">
            <p className="text-sm text-slate-400">{r.userName} • ⭐ {r.rating} • {r.status}</p>
            <p className="mb-3">{r.comment}</p>
            <div className="flex gap-2">
              <button className="btn-primary" onClick={() => reviewAction(r.id, 'approved')}>Approve</button>
              <button className="btn-muted" onClick={() => reviewAction(r.id, 'delete')}>Delete</button>
            </div>
          </div>
        ))}
        {!reviews.length && <p className="text-slate-400">No reviews yet.</p>}
      </div>
    </div>
  );
}
