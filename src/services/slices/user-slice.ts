import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  forgotPasswordApi,
  resetPasswordApi,
  TRegisterData,
  TLoginData
} from '../../utils/burger-api';
import { TUser } from '../../utils/types';

interface UserState {
  user: TUser | null;
  loading: boolean;
  error: string | null;
  passwordResetRequested: boolean;
}

const initialUserState: UserState = {
  user: null,
  loading: false,
  error: null,
  passwordResetRequested: false
};

export const registerUser = createAsyncThunk<
  { user: TUser; accessToken: string; refreshToken: string },
  TRegisterData,
  { rejectValue: string }
>('user/register', async (payload, { rejectWithValue }) => {
  try {
    const res = await registerUserApi(payload);
    return {
      user: res.user,
      accessToken: res.accessToken,
      refreshToken: res.refreshToken
    };
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});

export const loginUser = createAsyncThunk<
  { user: TUser; accessToken: string; refreshToken: string },
  TLoginData,
  { rejectValue: string }
>('user/login', async (payload, { rejectWithValue }) => {
  try {
    const res = await loginUserApi(payload);
    return {
      user: res.user,
      accessToken: res.accessToken,
      refreshToken: res.refreshToken
    };
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      localStorage.removeItem('refreshToken');
      document.cookie = 'accessToken=; path=/; max-age=0';
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

export const fetchUser = createAsyncThunk<TUser, void, { rejectValue: string }>(
  'user/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUserApi();
      return res.user;
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

export const updateUser = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('user/update', async (payload, { rejectWithValue }) => {
  try {
    const res = await updateUserApi(payload);
    return res.user;
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});

export const requestPasswordReset = createAsyncThunk<
  void,
  { email: string },
  { rejectValue: string }
>('user/requestPasswordReset', async (info, { rejectWithValue }) => {
  try {
    await forgotPasswordApi(info);
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});

export const resetPassword = createAsyncThunk<
  void,
  { password: string; token: string },
  { rejectValue: string }
>('user/resetPassword', async (payload, { rejectWithValue }) => {
  try {
    await resetPasswordApi(payload);
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    clearPasswordReset(state) {
      state.passwordResetRequested = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (draft) => {
        draft.loading = true;
        draft.error = null;
      })
      .addCase(registerUser.fulfilled, (draft, action) => {
        draft.user = action.payload.user;
        draft.loading = false;
      })
      .addCase(registerUser.rejected, (draft, action) => {
        draft.loading = false;
        draft.error = action.payload || 'Не удалось зарегистрироваться';
      })

      .addCase(loginUser.pending, (draft) => {
        draft.loading = true;
        draft.error = null;
      })
      .addCase(loginUser.fulfilled, (draft, action) => {
        draft.user = action.payload.user;
        draft.loading = false;
      })
      .addCase(loginUser.rejected, (draft, action) => {
        draft.loading = false;
        draft.error = action.payload || 'Ошибка входа в систему';
      })

      .addCase(logoutUser.pending, (draft) => {
        draft.loading = true;
        draft.error = null;
      })
      .addCase(logoutUser.fulfilled, (draft) => {
        draft.user = null;
        draft.loading = false;
      })
      .addCase(logoutUser.rejected, (draft, action) => {
        draft.loading = false;
        draft.error = action.payload || 'Ошибка выхода из аккаунта';
      })

      .addCase(fetchUser.pending, (draft) => {
        draft.loading = true;
        draft.error = null;
      })
      .addCase(fetchUser.fulfilled, (draft, action) => {
        draft.user = action.payload;
        draft.loading = false;
      })
      .addCase(fetchUser.rejected, (draft, action) => {
        draft.loading = false;
        draft.error = action.payload || 'Ошибка получения данных пользователя';
      })

      .addCase(updateUser.pending, (draft) => {
        draft.loading = true;
        draft.error = null;
      })
      .addCase(updateUser.fulfilled, (draft, action) => {
        draft.user = action.payload;
        draft.loading = false;
      })
      .addCase(updateUser.rejected, (draft, action) => {
        draft.loading = false;
        draft.error = action.payload || 'Ошибка обновления профиля';
      })

      .addCase(requestPasswordReset.pending, (draft) => {
        draft.loading = true;
        draft.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, (draft) => {
        draft.passwordResetRequested = true;
        draft.loading = false;
      })
      .addCase(requestPasswordReset.rejected, (draft, action) => {
        draft.loading = false;
        draft.error = action.payload || 'Ошибка запроса на восстановление';
      })

      .addCase(resetPassword.pending, (draft) => {
        draft.loading = true;
        draft.error = null;
      })
      .addCase(resetPassword.fulfilled, (draft) => {
        draft.passwordResetRequested = false;
        draft.loading = false;
      })
      .addCase(resetPassword.rejected, (draft, action) => {
        draft.loading = false;
        draft.error = action.payload || 'Ошибка сброса пароля';
      });
  }
});

export const { clearPasswordReset } = userSlice.actions;
export const userReducer = userSlice.reducer;