import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

const BookModal = ({ book, onClose, genres }) => {
  const isEditing = !!book;

  const addBookMutation = useMutation({
    mutationFn: apiService.addBook,
    onSuccess: () => {
      toast.success('Book added successfully!');
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add book');
      console.error('Add book error:', error);
    },
  });

  const updateBookMutation = useMutation({
    mutationFn: ({ id, ...data }) => apiService.updateBook(id, data),
    onSuccess: () => {
      toast.success('Book updated successfully!');
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update book');
      console.error('Update book error:', error);
    },
  });

  const validationSchema = Yup.object({
    title: Yup.string()
      .required('Title is required')
      .min(1, 'Title must be at least 1 character')
      .max(100, 'Title must be less than 100 characters'),
    author: Yup.string()
      .required('Author is required')
      .min(2, 'Author must be at least 2 characters')
      .max(50, 'Author must be less than 50 characters'),
    genre: Yup.string()
      .required('Genre is required'),
    publishedYear: Yup.number()
      .required('Published year is required')
      .integer('Year must be a whole number')
      .min(1000, 'Year must be after 1000')
      .max(new Date().getFullYear(), `Year cannot be later than ${new Date().getFullYear()}`),
    status: Yup.string()
      .required('Status is required')
      .oneOf(['Available', 'Issued'], 'Status must be Available or Issued'),
  });

  const formik = useFormik({
    initialValues: {
      title: book?.title || '',
      author: book?.author || '',
      genre: book?.genre || '',
      publishedYear: book?.publishedYear || '',
      status: book?.status || 'Available',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (isEditing) {
          await updateBookMutation.mutateAsync({
            id: book.id,
            ...values,
            publishedYear: parseInt(values.publishedYear),
          });
        } else {
          await addBookMutation.mutateAsync({
            ...values,
            publishedYear: parseInt(values.publishedYear),
          });
        }
      } catch (error) {
        console.error('Form submission error:', error);
      }
    },
  });

  const isLoading = addBookMutation.isPending || updateBookMutation.isPending;

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Book' : 'Add New Book'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            disabled={isLoading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={formik.handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
                  formik.touched.title && formik.errors.title
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="Enter book title"
                disabled={isLoading}
              />
              {formik.touched.title && formik.errors.title && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.title}</p>
              )}
            </div>

            {/* Author Field */}
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                Author *
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formik.values.author}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
                  formik.touched.author && formik.errors.author
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="Enter author name"
                disabled={isLoading}
              />
              {formik.touched.author && formik.errors.author && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.author}</p>
              )}
            </div>

            {/* Genre Field */}
            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
                Genre *
              </label>
              <select
                id="genre"
                name="genre"
                value={formik.values.genre}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
                  formik.touched.genre && formik.errors.genre
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                disabled={isLoading}
              >
                <option value="">Select a genre</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>
              {formik.touched.genre && formik.errors.genre && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.genre}</p>
              )}
            </div>

            {/* Published Year Field */}
            <div>
              <label htmlFor="publishedYear" className="block text-sm font-medium text-gray-700 mb-1">
                Published Year *
              </label>
              <input
                type="number"
                id="publishedYear"
                name="publishedYear"
                value={formik.values.publishedYear}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
                  formik.touched.publishedYear && formik.errors.publishedYear
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="Enter published year"
                min="1000"
                max={new Date().getFullYear()}
                disabled={isLoading}
              />
              {formik.touched.publishedYear && formik.errors.publishedYear && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.publishedYear}</p>
              )}
            </div>

            {/* Status Field */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                id="status"
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
                  formik.touched.status && formik.errors.status
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                disabled={isLoading}
              >
                <option value="Available">Available</option>
                <option value="Issued">Issued</option>
              </select>
              {formik.touched.status && formik.errors.status && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.status}</p>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading && (
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {isEditing ? 'Update Book' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookModal;