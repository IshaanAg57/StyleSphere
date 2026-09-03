import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Retrieve stored credentials from localStorage
const storedUser = localStorage.getItem('stylesphere_user');
let initialUserData = null;
let initialToken = null;

if (storedUser) {
  try {
    const parsed = JSON.parse(storedUser);
    initialUserData = parsed.user || null;
    initialToken = parsed.token || null;
  } catch (e) {
    initialUserData = null;
    initialToken = null;
    localStorage.removeItem('stylesphere_user');
  }
}

// Async Thunk: Register User
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, password, confirmPassword }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        confirmPassword
      });
      const data = response.data.data;
      localStorage.setItem('stylesphere_user', JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(
        error.message || 'Registration failed. Please try again.'
      );
    }
  }
);

// Async Thunk: Login User
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const data = response.data.data;
      localStorage.setItem('stylesphere_user', JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(
        error.message || 'Invalid email or password. Please try again.'
      );
    }
  }
);

// Async Thunk: Fetch Current User (/api/auth/me)
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await api.get('/auth/me');
      return response.data.data.user;
    } catch (error) {
      // If token is invalid or expired, remove stored credentials
      localStorage.removeItem('stylesphere_user');
      return rejectWithValue(error.message || 'Session expired');
    }
  }
);

const initialState = {
  user: initialUserData,
  token: initialToken,
  isAuthenticated: !!initialToken,
  loading: false,
  error: null,
  successMessage: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('stylesphere_user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
      state.successMessage = null;
      localStorage.removeItem('stylesphere_user');
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    clearAuthSuccess: (state) => {
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        state.successMessage = 'Account created successfully!';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        state.successMessage = 'Logged in successfully!';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Current User
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  }
});

export const { setCredentials, logout, clearAuthError, clearAuthSuccess } = authSlice.actions;
export default authSlice.reducer;
