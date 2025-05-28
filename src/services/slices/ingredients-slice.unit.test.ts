import { describe, test, expect, jest } from '@jest/globals';
import { ingredientsReducer, fetchIngredients } from './ingredients-slice';
import { configureStore } from '@reduxjs/toolkit';
import * as burgerApi from '../../utils/burger-api';

const createTestStore = () =>
  configureStore({
    reducer: {
      ingredients: ingredientsReducer,
    },
  });

describe('ingredients slice — async thunk fetchIngredients', () => {
  test('handles rejected without custom payload (default error)', () => {
    const store = createTestStore();

    store.dispatch({
      type: fetchIngredients.rejected.type,
      payload: undefined,
      error: { message: 'some failure' },
    });

    const state = store.getState().ingredients;
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Не удалось получить ингредиенты');
  });

  test('fetchIngredients succeeds and updates store with data', async () => {
    const store = createTestStore();

    const dummyData = [
      {
        _id: '42',
        name: 'Лунный соус',
        type: 'sauce',
        proteins: 9,
        fat: 3,
        carbohydrates: 2,
        calories: 99,
        price: 42,
        image: 'some-url',
        image_mobile: 'mobile-url',
        image_large: 'large-url',
      },
    ];

    jest.spyOn(burgerApi, 'getIngredientsApi').mockResolvedValueOnce(dummyData);

    await store.dispatch(fetchIngredients());

    const state = store.getState().ingredients;
    expect(state.loading).toBe(false);
    expect(state.items).toEqual(dummyData);
    expect(state.error).toBeNull();
  });

  test('fetchIngredients handles thrown error correctly', async () => {
    const store = createTestStore();
    const errText = 'API недоступен';

    jest.spyOn(burgerApi, 'getIngredientsApi').mockRejectedValueOnce(new Error(errText));

    await store.dispatch(fetchIngredients());

    const state = store.getState().ingredients;
    expect(state.loading).toBe(false);
    expect(state.items).toEqual([]);
    expect(state.error).toBe(errText);
  });
});