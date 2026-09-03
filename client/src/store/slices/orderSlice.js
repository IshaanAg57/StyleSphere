import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as orderService from '../../services/orderService';

export const createOrderAsync = createAsyncThunk(
  'orders/createOrderAsync',
  async (orderData, { rejectWithValue }) => {
    try {
      return await orderService.createOrder(orderData);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to place order');
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await orderService.getMyOrders(params);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderDetails = createAsyncThunk(
  'orders/fetchOrderDetails',
  async (orderId, { rejectWithValue }) => {
    try {
      return await orderService.getOrderById(orderId);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch order details');
    }
  }
);

const initialState = {
  orders: [],
  totalOrders: 0,
  page: 1,
  totalPages: 1,
  currentOrder: null,
  loading: false,
  createLoading: false,
  orderSuccess: false,
  error: null
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrderState: (state) => {
      state.createLoading = false;
      state.orderSuccess = false;
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrderAsync.pending, (state) => {
        state.createLoading = true;
        state.orderSuccess = false;
        state.error = null;
      })
      .addCase(createOrderAsync.fulfilled, (state, action) => {
        state.createLoading = false;
        state.orderSuccess = true;
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload);
      })
      .addCase(createOrderAsync.rejected, (state, action) => {
        state.createLoading = false;
        state.orderSuccess = false;
        state.error = action.payload;
      })

      // Fetch My Orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders || [];
        state.totalOrders = action.payload.totalOrders || 0;
        state.page = action.payload.page || 1;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Order Details
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetOrderState, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
