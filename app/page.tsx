"use client";

import { useState } from "react";

type Book = {
  id: number;
  title: string;
  pages: number;
  pagesRead: number;
  status: string;
};

const filters = [
  "All Books",
  "Want to Read",
  "Currently Reading",
  "Finished",
];

export default function Home() {
  const [title, setTitle] = useState("");
  const [pages, setPages] = useState("");
  const [status, setStatus] = useState("Want to Read");
  const [readingGoal, setReadingGoal] = useState(1000);
  const [activeFilter, setActiveFilter] = useState("All Books");
  const [search, setSearch] = useState("");

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
    if (!title.trim() || Number(pages) <= 0) return;

    const newBook: Book = {
      id: Date.now(),
      title: title.trim(),
      pages: Number(pages),
      pagesRead: status === "Finished" ? Number(pages) : 0,
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
        if (book.id !== id) return book;

        const safeProgress = Math.min(
          Math.max(newProgress, 0),
          book.pages
        );

        let newStatus = book.status;

        if (safeProgress >= book.pages) {
          newStatus = "Finished";
        } else if (safeProgress > 0) {
          newStatus = "Currently Reading";
        }

        return {
          ...book,
          pagesRead: safeProgress,
          status: newStatus,
        };
      })
    );
  }

  function updateStatus(id: number, newStatus: string) {
    setBooks(
      books.map((book) => {
        if (book.id !== id) return book;

        return {
          ...book,
          status: newStatus,
          pagesRead:
            newStatus === "Finished"
              ? book.pages
              : newStatus === "Want to Read"
              ? 0
              : book.pagesRead,
        };
      })
    );
  }

  function deleteBook(id: number) {
    setBooks(books.filter((book) => book.id !== id));
  }

  const totalPagesRead = books.reduce(
    (total, book) => total + book.pagesRead,
    0
  );

  const finishedBooks = books.filter(
    (book) => book.status === "Finished"
  ).length;

  const currentlyReading = books.filter(
    (book) => book.status === "Currently Reading"
  ).length;

  const wantToRead = books.filter(
    (book) => book.status === "Want to Read"
  ).length;

  const goalPercentage =
    readingGoal > 0
      ? Math.min(
          Math.round((totalPagesRead / readingGoal) * 100),
          100
        )
      : 0;

  const filteredBooks = books.filter((book) => {
    const matchesFilter =
      activeFilter === "All Books" || book.status === activeFilter;

    const matchesSearch = book.title
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[#f7f3ed] px-5 py-10 text-[#332d29] sm:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <header className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.22em] text-[#7c8b6b]">
              My Reading Journal
            </p>

            <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
              Reading Goals
            </h1>

            <p className="mt-3 max-w-xl text-[#756c66]">
              Build your reading list, track your progress, and reach your
              reading goals one page at a time.
            </p>
          </div>

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4f5d45] text-2xl text-white shadow-sm">
            📖
          </div>
        </header>

        {/* Goal Card */}
        <section className="overflow-hidden rounded-[2rem] bg-[#e3e8dc] shadow-sm">
          <div className="p-7 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#667357]">
                  2026 Reading Goal
                </p>

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-semibold">
                    {totalPagesRead}
                  </span>
                  <span className="text-[#667357]">
                    / {readingGoal} pages
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#667357]">
                  Page Goal
                </label>

                <input
                  type="number"
                  min="1"
                  value={readingGoal}
                  onChange={(e) =>
                    setReadingGoal(
                      Math.max(Number(e.target.value), 1)
                    )
                  }
                  className="mt-2 w-32 rounded-xl border border-[#c6cfbd] bg-white/70 px-4 py-2.5 outline-none transition focus:border-[#718261] focus:bg-white"
                />
              </div>
            </div>

            <div className="mt-7 h-3 overflow-hidden rounded-full bg-white/80">
              <div
                className="h-full rounded-full bg-[#718261] transition-all duration-500"
                style={{ width: `${goalPercentage}%` }}
              />
            </div>

            <div className="mt-3 flex justify-between text-sm text-[#667357]">
              <span>{goalPercentage}% completed</span>
              <span>
                {Math.max(readingGoal - totalPagesRead, 0)} pages to go
              </span>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef1e9]">
              📄
            </div>
            <p className="text-sm text-[#847a73]">Pages Read</p>
            <p className="mt-1 text-3xl font-semibold">
              {totalPagesRead}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef1e9]">
              📚
            </div>
            <p className="text-sm text-[#847a73]">
              Currently Reading
            </p>
            <p className="mt-1 text-3xl font-semibold">
              {currentlyReading}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef1e9]">
              ✓
            </div>
            <p className="text-sm text-[#847a73]">
              Books Finished
            </p>
            <p className="mt-1 text-3xl font-semibold">
              {finishedBooks}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef1e9]">
              ♡
            </div>
            <p className="text-sm text-[#847a73]">Want to Read</p>
            <p className="mt-1 text-3xl font-semibold">
              {wantToRead}
            </p>
          </div>
        </section>

        {/* Add Book */}
        <section className="mt-8 rounded-[2rem] bg-white p-7 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef1e9] text-xl">
              +
            </div>

            <div>
              <h2 className="text-2xl font-semibold">Add a Book</h2>
              <p className="text-sm text-[#847a73]">
                Add something new to your reading list.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#625b56]">
                Book title
              </label>
              <input
                type="text"
                placeholder="e.g. The Seven Husbands of Evelyn Hugo"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-[#ded8d1] bg-[#fcfaf7] p-3.5 outline-none transition focus:border-[#7c8b6b] focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#625b56]">
                Number of pages
              </label>
              <input
                type="number"
                min="1"
                placeholder="e.g. 400"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                className="w-full rounded-xl border border-[#ded8d1] bg-[#fcfaf7] p-3.5 outline-none transition focus:border-[#7c8b6b] focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#625b56]">
                Reading status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-[#ded8d1] bg-[#fcfaf7] p-3.5 outline-none transition focus:border-[#7c8b6b] focus:bg-white"
              >
                <option>Want to Read</option>
                <option>Currently Reading</option>
                <option>Finished</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={addBook}
                className="w-full rounded-xl bg-[#4f5d45] px-5 py-3.5 font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#3f4b37]"
              >
                + Add to Library
              </button>
            </div>
          </div>
        </section>

        {/* Library */}
        <section className="mt-12">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-[#7c8b6b]">
                Your Library
              </p>
              <h2 className="mt-1 text-3xl font-semibold">
                My Books
              </h2>
              <p className="mt-1 text-sm text-[#847a73]">
                {books.length}{" "}
                {books.length === 1 ? "book" : "books"} in your
                library
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full lg:w-72">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a928c]">
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search your library..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-[#ded8d1] bg-white py-3 pl-10 pr-4 outline-none transition focus:border-[#7c8b6b]"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-wrap gap-2">
            {filters.map((filter) => {
              const count =
                filter === "All Books"
                  ? books.length
                  : books.filter(
                      (book) => book.status === filter
                    ).length;

              const active = activeFilter === filter;

              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-[#4f5d45] text-white shadow-sm"
                      : "bg-white text-[#6e655f] hover:bg-[#eeeae4]"
                  }`}
                >
                  {filter}
                  <span
                    className={`ml-2 ${
                      active
                        ? "text-[#dce3d5]"
                        : "text-[#a69e98]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Book Results */}
          {filteredBooks.length === 0 ? (
            <div className="mt-6 rounded-[2rem] border border-dashed border-[#d9d2ca] bg-white/60 p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef1e9] text-2xl">
                📚
              </div>

              <h3 className="mt-4 text-lg font-semibold">
                No books found
              </h3>

              <p className="mt-1 text-sm text-[#847a73]">
                {search
                  ? `No books match "${search}".`
                  : activeFilter === "All Books"
                  ? "Add your first book to start building your library."
                  : `You don't have any books marked as "${activeFilter}" yet.`}
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-5">
              {filteredBooks.map((book) => {
                const percentage =
                  book.pages > 0
                    ? Math.round(
                        (book.pagesRead / book.pages) * 100
                      )
                    : 0;

                return (
                  <article
                    key={book.id}
                    className="group rounded-[2rem] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-7"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex gap-4">
                        {/* Decorative Book Cover */}
                        <div className="hidden h-24 w-16 shrink-0 items-center justify-center rounded-lg bg-[#59664e] text-2xl text-white shadow-sm sm:flex">
                          📖
                        </div>

                        <div>
                          <select
                            value={book.status}
                            onChange={(e) =>
                              updateStatus(
                                book.id,
                                e.target.value
                              )
                            }
                            className="rounded-full border-0 bg-[#edf0e8] px-3 py-1.5 text-xs font-medium text-[#667357] outline-none"
                          >
                            <option>Want to Read</option>
                            <option>Currently Reading</option>
                            <option>Finished</option>
                          </select>

                          <h3 className="mt-3 text-xl font-semibold">
                            {book.title}
                          </h3>

                          <p className="mt-1 text-sm text-[#847a73]">
                            {book.pages} total pages
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start justify-between gap-5 sm:justify-end">
                        <div className="text-left sm:text-right">
                          <p className="text-3xl font-semibold">
                            {percentage}%
                          </p>
                          <p className="text-xs text-[#847a73]">
                            completed
                          </p>
                        </div>

                        <button
                          onClick={() => deleteBook(book.id)}
                          className="rounded-xl px-3 py-2 text-sm text-[#9a655f] transition hover:bg-[#f8eeee]"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="mt-6 h-2.5 overflow-hidden rounded-full bg-[#eeeae5]">
                      <div
                        className="h-full rounded-full bg-[#7c8b6b] transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-[#756c66]">
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
                          className="w-24 rounded-lg border border-[#ded8d1] bg-[#fcfaf7] px-3 py-2 outline-none transition focus:border-[#7c8b6b]"
                        />

                        <span className="text-sm text-[#847a73]">
                          / {book.pages}
                        </span>
                      </div>

                      <p className="text-sm text-[#847a73]">
                        {book.pages - book.pagesRead > 0
                          ? `${
                              book.pages - book.pagesRead
                            } pages remaining`
                          : "Book completed ✓"}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}