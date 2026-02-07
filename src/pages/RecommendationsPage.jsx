import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';
import { getRecommendations } from '../utils/recommendations';

export default function RecommendationsPage() {
  const { session } = useAuth();
  const { books, library, reviews } = useLibrary();
  const recs = getRecommendations({ books, library, reviews, userId: session.user.id });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Personalized Recommendations</h1>
      <div className="grid gap-3 md:grid-cols-2">
        {recs.map((b) => (
          <div key={b.id} className="card">
            <p className="font-semibold">{b.title}</p>
            <p className="text-sm text-slate-400">{b.genre} • ⭐ {b.rating}</p>
            <p className="mt-2 text-sm text-amber-300">Why this book? {b.why}</p>
          </div>
        ))}
      </div>
      {!recs.length && <p className="text-slate-400">Keep reading to unlock better recommendations.</p>}
    </div>
  );
}
