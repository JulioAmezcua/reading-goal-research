"use client";

import { useState } from "react";

type Book = {
  id: number;
  title: string;
  pages: number;
  pagesRead: number;
  status: string;
};

export default function Home() {
  const [title, setTitle] = useState("");
  const [pages, setPages] = useState("");
  const [status, setStatus] = useState("Want to Read");

  const [books, setBooks] = useState<Book[]>([
    {
      id: 1,
      title: "The Hunger Games",
      pages: 374,
      pagesRead: 126,
      status: "Currently Reading",
    },
  ]);

  function addBook() {
    if (!title.trim()) return;

    const newBook: Book = {
      id: Date.now(),
      title,
      pages: Number(pages) || 0,
      pagesRead: 0,
      status,
    };

    setBooks([...books, newBook]);
    setTitle("");
    setPages("");
    setStatus("Want to Read");
  }

  function updateProgress(id: number, newProgress: number) {
    setBooks(
      books.map((book) => {
        if (book.id === id) {
          const safeProgress = Math.min(
            Math.max(newProgress, 0),
            book.pages
          );

          return {
            ...book,
            pagesRead: safeProgress,
            status:
              safeProgress >= book.pages && book.pages > 0
                ? "Finished"
                : safeProgress > 0
                ? "Currently Reading"
                : book.status,
          };
        }

        return book;
      })
    );
  }

  const totalPagesRead = books.reduce(
    (total, book) => total + book.pagesRead,
    0
  );

  const readingGoal = 1000;

  const goalPercentage = Math.min(
    Math.round((totalPagesRead / readingGoal) * 100),
    100
  );

  return (
    <main className="min-h-screen bg-[#f7f3ed] px-6 py-10 text-[#332d29]">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-10">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-[#7c8b6b]">
            My Reading Journal
          </p>

          <h1 className="text-5xl font-semibold tracking-tight">
            Reading Goals
          </h1>

          <p className="mt-3 text-[#756c66]">
            Keep track of your books and watch your reading progress grow.
          </p>
        </div>

        {/* Reading Goal */}
        <section className="rounded-3xl bg-[#e6eadf] p-7 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#667357]">
                2026 READING GOAL
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                {totalPagesRead} of {readingGoal} pages
              </h2>
            </div>

            <div className="text-3xl">🌿</div>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-[#718261] transition-all"
              style={{ width: `${goalPercentage}%` }}
            />
          </div>

          <p className="mt-2 text-sm text-[#667357]">
            {goalPercentage}% of your goal completed
          </p>
        </section>

        {/* Add Book */}
        <section className="mt-8 rounded-3xl bg-white p-7 shadow-sm">
          <h2 className="text-2xl font-semibold">Add a Book</h2>

          <p className="mt-1 text-sm text-[#847a73]">
            Add something new to your reading list.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Book title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl border border-[#ded8d1] bg-[#fcfaf7] p-3 outline-none focus:border-[#7c8b6b]"
            />

            <input
              type="number"
              placeholder="Number of pages"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              className="rounded-xl border border-[#ded8d1] bg-[#fcfaf7] p-3 outline-none focus:border-[#7c8b6b]"
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-xl border border-[#ded8d1] bg-[#fcfaf7] p-3 outline-none focus:border-[#7c8b6b]"
            >
              <option>Want to Read</option>
              <option>Currently Reading</option>
              <option>Finished</option>
            </select>

            <button
              onClick={addBook}
              className="rounded-xl bg-[#4f5d45] px-5 py-3 font-medium text-white transition hover:bg-[#3f4b37]"
            >
              + Add Book
            </button>
          </div>
        </section>

        {/* Books */}
        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-[#7c8b6b]">
                Your Library
              </p>

              <h2 className="text-3xl font-semibold">My Books</h2>
            </div>

            <p className="text-sm text-[#847a73]">
              {books.length} {books.length === 1 ? "book" : "books"}
            </p>
          </div>

          {books.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
              <p className="text-4xl">📖</p>
              <p className="mt-3 text-[#847a73]">
                Your bookshelf is empty. Add your first book above.
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              {books.map((book) => {
                const percentage =
                  book.pages > 0
                    ? Math.round((book.pagesRead / book.pages) * 100)
                    : 0;

                return (
                  <div
                    key={book.id}
                    className="rounded-3xl bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="rounded-full bg-[#edf0e8] px-3 py-1 text-xs font-medium text-[#667357]">
                          {book.status}
                        </span>

                        <h3 className="mt-3 text-xl font-semibold">
                          {book.title}
                        </h3>

                        <p className="mt-1 text-sm text-[#847a73]">
                          {book.pages} pages
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-semibold">
                          {percentage}%
                        </p>

                        <p className="text-xs text-[#847a73]">
                          completed
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-[#eeeae5]">
                      <div
                        className="h-full rounded-full bg-[#7c8b6b] transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                      <label className="text-sm text-[#756c66]">
                        Pages read
                      </label>

                      <input
                        type="number"
                        min="0"
                        max={book.pages}
                        value={book.pagesRead}
                        onChange={(e) =>
                          updateProgress(
                            book.id,
                            Number(e.target.value)
                          )
                        }
                        className="w-28 rounded-lg border border-[#ded8d1] bg-[#fcfaf7] px-3 py-2 outline-none focus:border-[#7c8b6b]"
                      />

                      <p className="text-sm text-[#847a73]">
                        of {book.pages} pages
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}