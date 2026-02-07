import express from 'express';
import cors from 'cors';
import crypto from 'crypto';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'bookworm-dev-secret';

const genres = ['Mystery', 'Fantasy', 'Sci-Fi', 'History', 'Romance', 'Self-Help'];
const books = [
  { id: 'b1', title: 'The Silent Key', author: 'R. Das', genre: 'Mystery', rating: 4.7, shelved: 210, cover: '', description: 'A gripping detective story.' },
  { id: 'b2', title: 'Starlight Protocol', author: 'A. Khan', genre: 'Sci-Fi', rating: 4.5, shelved: 145, cover: '', description: 'AI, space and humanity collide.' },
  { id: 'b3', title: 'Forest of Whispers', author: 'M. Noor', genre: 'Fantasy', rating: 4.8, shelved: 312, cover: '', description: 'Magic and ancient prophecies.' },
  { id: 'b4', title: 'Deep Work Daily', author: 'S. Rahman', genre: 'Self-Help', rating: 4.3, shelved: 98, cover: '', description: 'Productivity habits that stick.' },
];
const tutorials = [
  { id: 't1', title: 'How to Read More Books', youtubeId: 'lIW5jBrrsS0' },
  { id: 't2', title: 'Annotating Books for Better Retention', youtubeId: 'nP5M8QxgQ5A' },
];
const users = [
  { id: 'u-admin', name: 'Admin', email: 'admin@bookworm.app', password: 'Admin@1234', role: 'admin', photo: '' },
];
const library = [];
const reviews = [];

const createToken = (payload) => {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${sig}`;
};

const verifyToken = (token) => {
  const [header, body, sig] = token.split('.');
  if (!header || !body || !sig) return null;
  const expected = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  if (expected !== sig) return null;
  return JSON.parse(Buffer.from(body, 'base64url').toString());
};

const auth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Token missing' });
  const payload = verifyToken(token);
  if (!payload?.id) return res.status(401).json({ message: 'Invalid token' });
  req.user = payload;
  next();
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only route' });
  next();
};

app.get('/api/health', (_, res) => res.json({ ok: true }));

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, photo } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing required fields' });
  if (password.length < 8) return res.status(400).json({ message: 'Weak password' });
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) return res.status(409).json({ message: 'Duplicate email' });
  const user = { id: crypto.randomUUID(), name, email, password, photo: photo || '', role: 'user' };
  users.push(user);
  res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role, photo: user.photo });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email.toLowerCase() === String(email).toLowerCase() && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const token = createToken({ id: user.id, role: user.role, email: user.email, name: user.name });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, photo: user.photo } });
});

app.get('/api/books', auth, (req, res) => {
  const { search = '', genres: genreQuery = '', minRating = '0', maxRating = '5', sort = 'rating', page = '1', limit = '10' } = req.query;
  const genreList = genreQuery ? String(genreQuery).split(',').map((g) => g.trim()) : [];
  const min = Number(minRating);
  const max = Number(maxRating);
  const pageNum = Number(page);
  const size = Number(limit);

  const filtered = books
    .filter((b) => `${b.title} ${b.author}`.toLowerCase().includes(String(search).toLowerCase()))
    .filter((b) => !genreList.length || genreList.includes(b.genre))
    .filter((b) => b.rating >= min && b.rating <= max)
    .sort((a, b) => (sort === 'shelved' ? b.shelved - a.shelved : b.rating - a.rating));

  const total = filtered.length;
  const paged = filtered.slice((pageNum - 1) * size, pageNum * size);
  res.json({ data: paged, total, page: pageNum, limit: size });
});

app.get('/api/books/:bookId', auth, (req, res) => {
  const book = books.find((b) => b.id === req.params.bookId);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  const approved = reviews.filter((r) => r.bookId === book.id && r.status === 'approved');
  res.json({ ...book, reviews: approved });
});

app.get('/api/library', auth, (req, res) => {
  const mine = library.filter((l) => l.userId === req.user.id);
  res.json(mine.map((entry) => ({ ...entry, book: books.find((b) => b.id === entry.bookId) }))); 
});

app.post('/api/library', auth, (req, res) => {
  const { bookId, shelf } = req.body;
  if (!bookId || !['want', 'reading', 'read'].includes(shelf)) return res.status(400).json({ message: 'Invalid payload' });
  const book = books.find((b) => b.id === bookId);
  if (!book) return res.status(404).json({ message: 'Book not found' });

  const existing = library.find((l) => l.userId === req.user.id && l.bookId === bookId);
  if (existing) {
    existing.shelf = shelf;
    return res.json(existing);
  }

  const entry = { id: crypto.randomUUID(), userId: req.user.id, bookId, shelf, progress: 0 };
  library.push(entry);
  book.shelved += 1;
  res.status(201).json(entry);
});

app.patch('/api/library/:entryId/progress', auth, (req, res) => {
  const { progress } = req.body;
  const entry = library.find((l) => l.id === req.params.entryId && l.userId === req.user.id);
  if (!entry) return res.status(404).json({ message: 'Library entry not found' });
  entry.progress = Math.max(0, Math.min(100, Number(progress)));
  res.json(entry);
});

app.post('/api/reviews', auth, (req, res) => {
  const { bookId, rating, comment } = req.body;
  if (!bookId || !rating || !comment) return res.status(400).json({ message: 'Missing review fields' });
  const review = {
    id: crypto.randomUUID(),
    userId: req.user.id,
    userName: req.user.name,
    bookId,
    rating: Number(rating),
    comment,
    status: 'pending',
  };
  reviews.push(review);
  res.status(201).json(review);
});

app.get('/api/recommendations', auth, (req, res) => {
  const entries = library.filter((l) => l.userId === req.user.id);
  const readItems = entries.filter((l) => l.shelf === 'read');
  const already = new Set(entries.map((l) => l.bookId));

  if (readItems.length < 3) {
    const fallback = [...books]
      .sort((a, b) => b.rating - a.rating)
      .filter((b) => !already.has(b.id))
      .slice(0, 6)
      .map((b) => ({ ...b, why: 'Fallback: top-rated books while you build reading history.' }));
    return res.json(fallback);
  }

  const genreCount = {};
  readItems.forEach((r) => {
    const genre = books.find((b) => b.id === r.bookId)?.genre;
    if (genre) genreCount[genre] = (genreCount[genre] || 0) + 1;
  });
  const topGenre = Object.entries(genreCount).sort((a, b) => b[1] - a[1])[0]?.[0];

  const myReviews = reviews.filter((r) => r.userId === req.user.id);
  const avg = myReviews.length ? myReviews.reduce((sum, item) => sum + item.rating, 0) / myReviews.length : 4;

  const recs = books
    .filter((b) => b.genre === topGenre && b.rating >= Math.max(4, avg) && !already.has(b.id))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6)
    .map((b) => ({ ...b, why: `You read ${genreCount[topGenre]} ${topGenre} books and rated them highly.` }));

  res.json(recs);
});

app.get('/api/tutorials', auth, (_, res) => res.json(tutorials));

app.get('/api/admin/dashboard', auth, adminOnly, (_, res) => {
  res.json({
    totalUsers: users.length,
    totalBooks: books.length,
    pendingReviews: reviews.filter((r) => r.status === 'pending').length,
  });
});

app.patch('/api/admin/users/:userId/role', auth, adminOnly, (req, res) => {
  const user = users.find((u) => u.id === req.params.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (!['admin', 'user'].includes(req.body.role)) return res.status(400).json({ message: 'Invalid role' });
  user.role = req.body.role;
  res.json({ id: user.id, role: user.role });
});

app.post('/api/admin/books', auth, adminOnly, (req, res) => {
  const { title, author, genre, description = '', cover = '' } = req.body;
  if (!title || !author || !genre) return res.status(400).json({ message: 'Missing required fields' });
  const book = { id: crypto.randomUUID(), title, author, genre, description, cover, rating: 0, shelved: 0 };
  books.push(book);
  res.status(201).json(book);
});

app.patch('/api/admin/books/:bookId', auth, adminOnly, (req, res) => {
  const book = books.find((b) => b.id === req.params.bookId);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  Object.assign(book, req.body);
  res.json(book);
});

app.delete('/api/admin/books/:bookId', auth, adminOnly, (req, res) => {
  const idx = books.findIndex((b) => b.id === req.params.bookId);
  if (idx < 0) return res.status(404).json({ message: 'Book not found' });
  books.splice(idx, 1);
  res.status(204).send();
});

app.get('/api/admin/genres', auth, adminOnly, (_, res) => res.json(genres));
app.post('/api/admin/genres', auth, adminOnly, (req, res) => {
  const name = String(req.body.name || '').trim();
  if (!name) return res.status(400).json({ message: 'Genre name required' });
  if (genres.includes(name)) return res.status(409).json({ message: 'Genre already exists' });
  genres.push(name);
  res.status(201).json({ name });
});

app.get('/api/admin/reviews', auth, adminOnly, (_, res) => res.json(reviews));
app.patch('/api/admin/reviews/:reviewId', auth, adminOnly, (req, res) => {
  const review = reviews.find((r) => r.id === req.params.reviewId);
  if (!review) return res.status(404).json({ message: 'Review not found' });
  if (!['approved', 'pending'].includes(req.body.status)) return res.status(400).json({ message: 'Invalid status' });
  review.status = req.body.status;
  res.json(review);
});

app.delete('/api/admin/reviews/:reviewId', auth, adminOnly, (req, res) => {
  const idx = reviews.findIndex((r) => r.id === req.params.reviewId);
  if (idx < 0) return res.status(404).json({ message: 'Review not found' });
  reviews.splice(idx, 1);
  res.status(204).send();
});

app.post('/api/admin/tutorials', auth, adminOnly, (req, res) => {
  const { title, youtubeId } = req.body;
  if (!title || !youtubeId) return res.status(400).json({ message: 'Title and youtubeId required' });
  const tutorial = { id: crypto.randomUUID(), title, youtubeId };
  tutorials.push(tutorial);
  res.status(201).json(tutorial);
});

app.patch('/api/admin/tutorials/:tutorialId', auth, adminOnly, (req, res) => {
  const tutorial = tutorials.find((t) => t.id === req.params.tutorialId);
  if (!tutorial) return res.status(404).json({ message: 'Tutorial not found' });
  Object.assign(tutorial, req.body);
  res.json(tutorial);
});

app.delete('/api/admin/tutorials/:tutorialId', auth, adminOnly, (req, res) => {
  const idx = tutorials.findIndex((t) => t.id === req.params.tutorialId);
  if (idx < 0) return res.status(404).json({ message: 'Tutorial not found' });
  tutorials.splice(idx, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`BookWorm API running on http://localhost:${PORT}`);
});
