import { configureStore, createSlice } from '@reduxjs/toolkit';

const booksSlice = createSlice({
  name: 'books',
  initialState: {
    searchTerm: '',
    selectedGenre: '',
    selectedStatus: '',
    currentPage: 1,
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.currentPage = 1; // Reset to first page when searching
    },
    setSelectedGenre: (state, action) => {
      state.selectedGenre = action.payload;
      state.currentPage = 1;
    },
    setSelectedStatus: (state, action) => {
      state.selectedStatus = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearFilters: (state) => {
      state.searchTerm = '';
      state.selectedGenre = '';
      state.selectedStatus = '';
      state.currentPage = 1;
    },
  },
});

export const {
  setSearchTerm,
  setSelectedGenre,
  setSelectedStatus,
  setCurrentPage,
  clearFilters,
} = booksSlice.actions;

export const store = configureStore({
  reducer: {
    books: booksSlice.reducer,
  },
});