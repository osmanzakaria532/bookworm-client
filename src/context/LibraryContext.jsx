import { createContext, useContext, useMemo, useState } from 'react';
import { initialBooks, tutorialsSeed } from '../data/mockData';

const LibraryContext = createContext(null);

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

export function LibraryProvider({ children }) {
  const [books, setBooks] = useState(() => read('bookworm-books', initialBooks));
  const [library, setLibrary] = useState(() => read('bookworm-library', []));
  const [reviews, setReviews] = useState(() => read('bookworm-reviews', []));
  const [tutorials, setTutorials] = useState(() => read('bookworm-tutorials', tutorialsSeed));

  const persist = (key, data, setState) => {
    setState(data);
    localStorage.setItem(key, JSON.stringify(data));
  };

  const addBook = (book) => persist('bookworm-books', [{ ...book, id: crypto.randomUUID(), shelved: 0, rating: 0 }, ...books], setBooks);
  const deleteBook = (id) => persist('bookworm-books', books.filter((b) => b.id !== id), setBooks);

  const addToShelf = (userId, bookId, shelf) => {
    const exists = library.find((l) => l.userId === userId && l.bookId === bookId);
    const next = exists
      ? library.map((l) => (l.userId === userId && l.bookId === bookId ? { ...l, shelf } : l))
      : [...library, { id: crypto.randomUUID(), userId, bookId, shelf, progress: 0 }];
    persist('bookworm-library', next, setLibrary);
  };

  const updateProgress = (entryId, progress) => {
    const next = library.map((l) => (l.id === entryId ? { ...l, progress: Number(progress) } : l));
    persist('bookworm-library', next, setLibrary);
  };

  const submitReview = (payload) => {
    const next = [{ id: crypto.randomUUID(), status: 'pending', ...payload }, ...reviews];
    persist('bookworm-reviews', next, setReviews);
  };

  const reviewAction = (reviewId, status) => {
    const next = status === 'delete' ? reviews.filter((r) => r.id !== reviewId) : reviews.map((r) => (r.id === reviewId ? { ...r, status } : r));
    persist('bookworm-reviews', next, setReviews);
  };

  const addTutorial = (payload) => persist('bookworm-tutorials', [{ id: crypto.randomUUID(), ...payload }, ...tutorials], setTutorials);

  const value = useMemo(() => ({ books, library, reviews, tutorials, addBook, deleteBook, addToShelf, updateProgress, submitReview, reviewAction, addTutorial }), [books, library, reviews, tutorials]);
  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export const useLibrary = () => useContext(LibraryContext);
