import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TBuilderIngredient, TIngredient } from 'src/utils/types';

interface BuilderState {
  bun: TBuilderIngredient | null;
  ingredients: TBuilderIngredient[];
}

const initialState: BuilderState = {
  bun: null,
  ingredients: []
};

const builderSlice = createSlice({
  name: 'builder',
  initialState,
  reducers: {
    setBun: {
      reducer(state, action: PayloadAction<TBuilderIngredient>) {
        state.bun = action.payload;
      },
      prepare(item: TIngredient) {
        return { payload: { ...item, id: nanoid() } };
      }
    },
    clearBun(current) {
      current.bun = null;
    },
    addIngredient: {
      reducer(current, action: PayloadAction<TBuilderIngredient>) {
        current.ingredients.push(action.payload);
      },
      prepare(entry: TIngredient) {
        return {
          payload: { ...entry, id: nanoid() }
        };
      }
    },
    removeIngredient(current, action: PayloadAction<string>) {
      current.ingredients = current.ingredients.filter(
        (i) => i.id !== action.payload
      );
    },
    moveIngredient(
      current,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) {
      const { fromIndex, toIndex } = action.payload;
      const [item] = current.ingredients.splice(fromIndex, 1);
      current.ingredients.splice(toIndex, 0, item);
    },
    clearBuilder(current) {
      current.bun = null;
      current.ingredients = [];
    }
  }
});

export const {
  setBun,
  clearBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearBuilder
} = builderSlice.actions;

export const builderReducer = builderSlice.reducer;