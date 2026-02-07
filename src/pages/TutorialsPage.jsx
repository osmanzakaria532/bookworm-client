import { useLibrary } from '../context/LibraryContext';

export default function TutorialsPage() {
  const { tutorials } = useLibrary();
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Reading Tutorials</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {tutorials.map((t) => (
          <div key={t.id} className="card">
            <p className="mb-2 font-semibold">{t.title}</p>
            <iframe className="h-56 w-full rounded-lg" src={`https://www.youtube.com/embed/${t.youtubeId}`} title={t.title} allowFullScreen />
          </div>
        ))}
      </div>
    </div>
  );
}
