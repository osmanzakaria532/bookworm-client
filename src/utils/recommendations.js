export function getRecommendations({ books, library, reviews, userId }) {
  const userEntries = library.filter((l) => l.userId === userId);
  const read = userEntries.filter((l) => l.shelf === 'read');
  const already = new Set(userEntries.map((l) => l.bookId));

  if (read.length < 3) {
    const topRated = [...books].sort((a, b) => b.rating - a.rating).slice(0, 4);
    const mostShelved = [...books].sort((a, b) => b.shelved - a.shelved).slice(0, 4);
    const mix = [...new Map([...topRated, ...mostShelved].map((b) => [b.id, b])).values()]
      .filter((b) => !already.has(b.id))
      .slice(0, 6);
    return mix.map((b) => ({ ...b, why: 'Fallback mix: top-rated and most-shelved books.' }));
  }

  const genreCount = {};
  read.forEach((r) => {
    const g = books.find((b) => b.id === r.bookId)?.genre;
    if (g) genreCount[g] = (genreCount[g] || 0) + 1;
  });

  const topGenre = Object.entries(genreCount).sort((a, b) => b[1] - a[1])[0]?.[0];
  const userRatings = reviews.filter((r) => r.userId === userId);
  const avg = userRatings.length ? userRatings.reduce((a, b) => a + Number(b.rating), 0) / userRatings.length : 4;

  return books
    .filter((b) => b.genre === topGenre && b.rating >= Math.max(4, avg) && !already.has(b.id))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6)
    .map((b) => ({ ...b, why: `You read ${genreCount[topGenre]} ${topGenre} books and rate them highly.` }));
}
