import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // Add useQueryClient
import { useSelector } from "react-redux";
import { apiService } from "../services/api";
import BookTable from "./BookTable";
import SearchAndFilters from "./SearchAndFilters";
import BookModal from "./BookModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import LoadingSkeleton from "./LoadingSkeleton";
import Pagination from "./Pagination";

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [deleteBook, setDeleteBook] = useState(null);
  const queryClient = useQueryClient(); // Get query client

  const { searchTerm, selectedGenre, selectedStatus, currentPage } =
    useSelector((state) => state.books);

  // Use proper query key and add refetch options
  const {
    data: books = [],
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["books"], // Important: unique key for caching
    queryFn: apiService.getBooks,
    retry: 2,
  });

  // Filter books based on search and filters
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      !searchTerm ||
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGenre = !selectedGenre || book.genre === selectedGenre;
    const matchesStatus = !selectedStatus || book.status === selectedStatus;

    return matchesSearch && matchesGenre && matchesStatus;
  });

  // Pagination
  const booksPerPage = 10;
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const paginatedBooks = filteredBooks.slice(
    startIndex,
    startIndex + booksPerPage
  );

  // Get unique genres and statuses for filters
  const genres = [...new Set(books.map((book) => book.genre))].sort();
  const statuses = [...new Set(books.map((book) => book.status))].sort();

  const handleAddBook = () => {
    setEditingBook(null);
    setIsModalOpen(true);
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (book) => {
    setDeleteBook(book);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingBook(null);
    // Invalidate and refetch the books query to get fresh data
    queryClient.invalidateQueries({ queryKey: ["books"] });
  };

  const handleDeleteConfirm = () => {
    setDeleteBook(null);
    // Invalidate and refetch the books query to get fresh data
    queryClient.invalidateQueries({ queryKey: ["books"] });
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 text-lg font-medium">
            Error loading books
          </p>
          <button
            onClick={() => refetch()}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Add this temporarily for debugging
  console.log("React Query state:", {
    isLoading,
    isError,
    error,
    booksData: books,
    booksLength: books.length,
  });

  return (
    <div className="space-y-6">
      {/* Header with Add Book Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Book Collection</h2>
          <p className="text-gray-600">
            {filteredBooks.length} book{filteredBooks.length !== 1 ? "s" : ""}{" "}
            found
          </p>
        </div>
        <button
          onClick={handleAddBook}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add New Book
        </button>
      </div>

      {/* Search and Filters */}
      <SearchAndFilters genres={genres} statuses={statuses} />

      {/* Books Table/Grid */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <BookTable
            books={paginatedBooks}
            onEdit={handleEditBook}
            onDelete={handleDeleteClick}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredBooks.length}
              itemsPerPage={booksPerPage}
            />
          )}
        </>
      )}

      {/* Modals */}
      {isModalOpen && (
        <BookModal
          book={editingBook}
          onClose={handleModalClose}
          genres={genres}
        />
      )}

      {deleteBook && (
        <DeleteConfirmModal
          book={deleteBook}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteBook(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
