import { createSlice } from '@reduxjs/toolkit';

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
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const discount = Math.round(subtotal * 0.1); // Example promotional discount
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.round((subtotal - discount) * 0.18); // 18% GST standard
  const total = subtotal - discount + shipping + tax;

  return { itemsCount, subtotal, discount, shipping, tax, total };
};

const totals = calculateTotals(initialItems);

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
          item.product === newItem.product &&
          item.size === newItem.size &&
          item.color === newItem.color
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
      const { product, size, color } = action.payload;
      state.items = state.items.filter(
        (item) =>
          !(item.product === product && item.size === size && item.color === color)
      );
      const calculated = calculateTotals(state.items);
      Object.assign(state, calculated);
      localStorage.setItem('stylesphere_cart', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { product, size, color, quantity } = action.payload;
      const item = state.items.find(
        (i) => i.product === product && i.size === size && i.color === color
      );
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
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
