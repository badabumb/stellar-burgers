import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

export interface FeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
}

const feedsInitialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

export const fetchFeed = createAsyncThunk<
  { orders: TOrder[]; total: number; totalToday: number },
  void,
  { rejectValue: string }
>('feed/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await getFeedsApi();
    return {
      orders: response.orders,
      total: response.total,
      totalToday: response.totalToday
    };
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});

const feedSlice = createSlice({
  name: 'feed',
  initialState: feedsInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (draft) => {
        draft.loading = true;
        draft.error = null;
      })
      .addCase(
        fetchFeed.fulfilled,
        (
          draft,
          action: PayloadAction<{
            orders: TOrder[];
            total: number;
            totalToday: number;
          }>
        ) => {
          draft.orders = action.payload.orders;
          draft.total = action.payload.total;
          draft.totalToday = action.payload.totalToday;
          draft.loading = false;
        }
      )
      .addCase(fetchFeed.rejected, (draft, action) => {
        draft.loading = false;
        draft.error = action.payload || 'Не удалось загрузить ленту';
      });
  }
});

export const feedReducer = feedSlice.reducer;
export { feedsInitialState };