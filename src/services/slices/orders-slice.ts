import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getOrdersApi,
  orderBurgerApi,
  getOrderByNumberApi
} from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

interface OrdersState {
  orders: TOrder[];
  currentOrder: TOrder | null;
  loading: boolean;
  error: string | null;
}

const initialOrdersState: OrdersState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null
};

export const fetchOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('orders/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await getOrdersApi();
    return response;
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});

export const createOrder = createAsyncThunk<
  { order: TOrder; name: string },
  string[],
  { rejectValue: string }
>('orders/create', async (items, { rejectWithValue }) => {
  try {
    const result = await orderBurgerApi(items);
    return result;
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});

export const fetchOrderByNumber = createAsyncThunk<
  TOrder[],
  number,
  { rejectValue: string }
>('orders/fetchByNumber', async (id, { rejectWithValue }) => {
  try {
    const data = await getOrderByNumberApi(id);
    return data.orders;
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState: initialOrdersState,
  reducers: {
    clearCurrentOrder(state) {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (draft) => {
        draft.loading = true;
        draft.error = null;
      })
      .addCase(
        fetchOrders.fulfilled,
        (draft, action: PayloadAction<TOrder[]>) => {
          draft.orders = action.payload;
          draft.loading = false;
        }
      )
      .addCase(fetchOrders.rejected, (draft, action) => {
        draft.loading = false;
        draft.error = action.payload || 'Ошибка при получении заказов';
      })

      .addCase(createOrder.pending, (draft) => {
        draft.loading = true;
        draft.error = null;
      })
      .addCase(
        createOrder.fulfilled,
        (draft, action: PayloadAction<{ order: TOrder; name: string }>) => {
          const { order } = action.payload;
          draft.orders.unshift(order);
          draft.currentOrder = order;
          draft.loading = false;
        }
      )
      .addCase(createOrder.rejected, (draft, action) => {
        draft.loading = false;
        draft.error = action.payload || 'Ошибка при создании заказа';
      })

      .addCase(fetchOrderByNumber.pending, (draft) => {
        draft.loading = true;
        draft.error = null;
      })
      .addCase(
        fetchOrderByNumber.fulfilled,
        (draft, action: PayloadAction<TOrder[]>) => {
          draft.currentOrder = null;
          draft.loading = false;
        }
      )
      .addCase(fetchOrderByNumber.rejected, (draft, action) => {
        draft.loading = false;
        draft.error = action.payload || 'Ошибка получения заказа по номеру';
      });
  }
});

export const { clearCurrentOrder } = ordersSlice.actions;
export const ordersReducer = ordersSlice.reducer;