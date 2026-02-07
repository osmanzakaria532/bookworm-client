import { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';

export default function AdminTutorialsPage() {
  const { tutorials, addTutorial } = useLibrary();
  const [form, setForm] = useState({ title: '', youtubeId: '' });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Tutorial Management</h1>
      <div className="card grid gap-2 md:grid-cols-2">
        <input className="input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="input" placeholder="YouTube Video ID" value={form.youtubeId} onChange={(e) => setForm({ ...form, youtubeId: e.target.value })} />
        <button className="btn-primary md:col-span-2" onClick={() => addTutorial(form)}>Add Tutorial</button>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        {tutorials.map((t) => <div key={t.id} className="card"><p>{t.title}</p><p className="text-xs text-slate-400">{t.youtubeId}</p></div>)}
      </div>
    </div>
  );
}
