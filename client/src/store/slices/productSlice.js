import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getProducts,
  getProductBySlug,
  getFeaturedProducts,
  getTrendingProducts,
  getCategories
} from '../../services/productService';

// Async Thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await getProducts(params);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductBySlug = createAsyncThunk(
  'products/fetchProductBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      return await getProductBySlug(slug);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch product details');
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (_, { rejectWithValue }) => {
    try {
      return await getFeaturedProducts();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch featured products');
    }
  }
);

export const fetchTrendingProducts = createAsyncThunk(
  'products/fetchTrendingProducts',
  async (_, { rejectWithValue }) => {
    try {
      return await getTrendingProducts();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch trending products');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await getCategories();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch categories');
    }
  }
);

const initialState = {
  products: [],
  totalProducts: 0,
  page: 1,
  totalPages: 1,
  limit: 12,
  hasMore: false,
  selectedProduct: null,
  relatedProducts: [],
  featuredProducts: [],
  trendingProducts: [],
  categories: [],
  loading: false,
  detailsLoading: false,
  error: null,
  filters: {
    q: '',
    category: 'all',
    gender: 'all',
    minPrice: '',
    maxPrice: '',
    size: 'all',
    color: 'all',
    sort: 'newest'
  }
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        q: '',
        category: 'all',
        gender: 'all',
        minPrice: '',
        maxPrice: '',
        size: 'all',
        color: 'all',
        sort: 'newest'
      };
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
      state.relatedProducts = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalProducts = action.payload.totalProducts;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Product by Slug
      .addCase(fetchProductBySlug.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedProduct = action.payload.product;
        state.relatedProducts = action.payload.relatedProducts || [];
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload;
      })

      // Featured
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredProducts = action.payload;
      })

      // Trending
      .addCase(fetchTrendingProducts.fulfilled, (state, action) => {
        state.trendingProducts = action.payload;
      })

      // Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  }
});

export const { setFilter, resetFilters, clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
