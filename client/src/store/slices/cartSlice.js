import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as cartService from '../../services/cartService';

const storedCart = localStorage.getItem('stylesphere_cart');
let initialItems = [];
if (storedCart) {
  try {
    initialItems = JSON.parse(storedCart);
  } catch (e) {
    initialItems = [];
  }
}

const calculateTotals = (items) => {
  const itemsCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + (item.price || item.priceAtAddition || 0) * item.quantity,
    0
  );
  const discount = Math.round(subtotal * 0.1); // 10% promotional privilege
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const tax = Math.round((subtotal - discount) * 0.18); // 18% GST standard
  const total = Math.max(0, subtotal - discount + shipping + tax);

  return { itemsCount, subtotal, discount, shipping, tax, total };
};

const totals = calculateTotals(initialItems);

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    return await cartService.getCart();
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch cart');
  }
});

export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async (payload, { rejectWithValue }) => {
    try {
      return await cartService.addToCart(payload);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add item to bag');
    }
  }
);

export const updateCartItemAsync = createAsyncThunk(
  'cart/updateCartItemAsync',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      return await cartService.updateCartItem(itemId, quantity);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update quantity');
    }
  }
);

export const removeCartItemAsync = createAsyncThunk(
  'cart/removeCartItemAsync',
  async (itemId, { rejectWithValue }) => {
    try {
      return await cartService.removeCartItem(itemId);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to remove item');
    }
  }
);

export const clearCartAsync = createAsyncThunk(
  'cart/clearCartAsync',
  async (_, { rejectWithValue }) => {
    try {
      return await cartService.clearCart();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to clear bag');
    }
  }
);

const initialState = {
  items: initialItems,
  ...totals,
  loading: false,
  error: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingIndex = state.items.findIndex(
        (item) =>
          (item.product?._id || item.product) === (newItem.product?._id || newItem.product) &&
          (item.selectedSize || item.size) === (newItem.selectedSize || newItem.size) &&
          (item.selectedColor || item.color) === (newItem.selectedColor || newItem.color)
      );

      if (existingIndex > -1) {
        state.items[existingIndex].quantity += newItem.quantity || 1;
      } else {
        state.items.push(newItem);
      }

      const calculated = calculateTotals(state.items);
      Object.assign(state, calculated);
      localStorage.setItem('stylesphere_cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      const { product, size, color, _id } = action.payload;
      state.items = state.items.filter((item) => {
        if (_id && item._id) return item._id !== _id;
        const pId = item.product?._id || item.product;
        const s = item.selectedSize || item.size;
        const c = item.selectedColor || item.color;
        return !(pId === product && s === size && c === color);
      });
      const calculated = calculateTotals(state.items);
      Object.assign(state, calculated);
      localStorage.setItem('stylesphere_cart', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { product, size, color, quantity, _id } = action.payload;
      const item = state.items.find((i) => {
        if (_id && i._id) return i._id === _id;
        const pId = i.product?._id || i.product;
        const s = i.selectedSize || i.size;
        const c = i.selectedColor || i.color;
        return pId === product && s === size && c === color;
      });

      if (item && quantity > 0) {
        item.quantity = quantity;
      }
      const calculated = calculateTotals(state.items);
      Object.assign(state, calculated);
      localStorage.setItem('stylesphere_cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      const calculated = calculateTotals([]);
      Object.assign(state, calculated);
      localStorage.removeItem('stylesphere_cart');
    }
  },
  extraReducers: (builder) => {
    // Handle async thunks synchronized with server
    const handleCartFulfilled = (state, action) => {
      state.loading = false;
      state.error = null;
      if (action.payload) {
        state.items = action.payload.items || [];
        state.itemsCount = action.payload.itemsCount || 0;
        state.subtotal = action.payload.subtotal || 0;
        state.discount = action.payload.discount || 0;
        state.shipping = action.payload.shipping || 0;
        state.tax = action.payload.tax || 0;
        state.total = action.payload.total || 0;
        localStorage.setItem('stylesphere_cart', JSON.stringify(state.items));
      }
    };

    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, handleCartFulfilled)
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addToCartAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCartAsync.fulfilled, handleCartFulfilled)
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateCartItemAsync.fulfilled, handleCartFulfilled)
      .addCase(removeCartItemAsync.fulfilled, handleCartFulfilled)
      .addCase(clearCartAsync.fulfilled, handleCartFulfilled);
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
