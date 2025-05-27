import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '../../utils/types';

export interface IngredientsState {
  items: TIngredient[];
  loading: boolean;
  error: string | null;
}

const ingredientsInitialState: IngredientsState = {
  items: [],
  loading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetch', async (_, { rejectWithValue }) => {
  try {
    const result = await getIngredientsApi();
    return result;
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: ingredientsInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (draft) => {
        draft.loading = true;
        draft.error = null;
      })
      .addCase(
        fetchIngredients.fulfilled,
        (draft, action: PayloadAction<TIngredient[]>) => {
          draft.items = action.payload;
          draft.loading = false;
        }
      )
      .addCase(fetchIngredients.rejected, (draft, action) => {
        draft.loading = false;
        draft.error = action.payload || 'Не удалось получить ингредиенты';
      });
  }
});

export const ingredientsReducer = ingredientsSlice.reducer;
export { ingredientsInitialState };