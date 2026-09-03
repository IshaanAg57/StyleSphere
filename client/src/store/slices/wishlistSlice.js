import { createSlice } from '@reduxjs/toolkit';

const storedWishlist = localStorage.getItem('stylesphere_wishlist');
let initialWishlist = [];
if (storedWishlist) {
  try {
    initialWishlist = JSON.parse(storedWishlist);
  } catch (e) {
    initialWishlist = [];
  }
}

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
      const index = state.items.findIndex((item) => (item._id || item.id) === (product._id || product.id));
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
  }
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
