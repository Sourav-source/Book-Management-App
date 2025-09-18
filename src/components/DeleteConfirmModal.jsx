import React, { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

const DeleteConfirmModal = ({ book, onConfirm, onCancel }) => {
const deleteBookMutation = useMutation({
    mutationFn: apiService.deleteBook,
    onSuccess: () => {
      toast.success('Book deleted successfully!');
      onConfirm();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete book');
      console.error('Delete book error:', error);
    },
  });

  const handleDelete = async () => {
    try {
      await deleteBookMutation.mutateAsync(book.id);
    } catch (error) {
      console.error('Delete confirmation error:', error);
    }
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        onCancel();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onCancel]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Modal Content */}
        <div className="p-6">
          {/* Warning Icon */}
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          {/* Modal Header */}
          <div className="text-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Delete Book
            </h3>
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this book? This action cannot be undone.
            </p>
          </div>

          {/* Book Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-center">
              <h4 className="font-medium text-gray-900">{book.title}</h4>
              <p className="text-sm text-gray-600">by {book.author}</p>
              <div className="flex justify-center gap-2 mt-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {book.genre}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    book.status === 'Available'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {book.status}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
              disabled={deleteBookMutation.isPending}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
              disabled={deleteBookMutation.isPending}
            >
              {deleteBookMutation.isPending && (
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              Delete Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;