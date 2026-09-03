import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as wishlistService from '../../services/wishlistService';

const storedWishlist = localStorage.getItem('stylesphere_wishlist');
let initialWishlist = [];
if (storedWishlist) {
  try {
    initialWishlist = JSON.parse(storedWishlist);
  } catch (e) {
    initialWishlist = [];
  }
}

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      return await wishlistService.getWishlist();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch wishlist');
    }
  }
);

export const addToWishlistAsync = createAsyncThunk(
  'wishlist/addToWishlistAsync',
  async (productId, { rejectWithValue }) => {
    try {
      return await wishlistService.addToWishlist(productId);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add to wishlist');
    }
  }
);

export const removeFromWishlistAsync = createAsyncThunk(
  'wishlist/removeFromWishlistAsync',
  async (productId, { rejectWithValue }) => {
    try {
      return await wishlistService.removeFromWishlist(productId);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to remove from wishlist');
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: initialWishlist,
    loading: false,
    error: null
  },
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const index = state.items.findIndex(
        (item) => (item._id || item.id) === (product._id || product.id)
      );
      if (index > -1) {
        state.items.splice(index, 1);
      } else {
        state.items.push(product);
      }
      localStorage.setItem('stylesphere_wishlist', JSON.stringify(state.items));
    },
    removeFromWishlist: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => (item._id || item.id) !== id);
      localStorage.setItem('stylesphere_wishlist', JSON.stringify(state.items));
    },
    clearWishlist: (state) => {
      state.items = [];
      localStorage.removeItem('stylesphere_wishlist');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
        localStorage.setItem('stylesphere_wishlist', JSON.stringify(state.items));
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addToWishlistAsync.fulfilled, (state, action) => {
        state.items = action.payload || [];
        localStorage.setItem('stylesphere_wishlist', JSON.stringify(state.items));
      })
      .addCase(removeFromWishlistAsync.fulfilled, (state, action) => {
        state.items = action.payload || [];
        localStorage.setItem('stylesphere_wishlist', JSON.stringify(state.items));
      });
  }
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
