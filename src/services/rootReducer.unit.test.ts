import { test, describe, expect } from '@jest/globals';
import { rootReducer } from './root-reducer';

import { userInitialState } from './slices/user-slice';
import { feedsInitialState } from './slices/feeds-slice';
import { ordersInitialState } from './slices/orders-slice';
import { ingredientsInitialState } from './slices/ingredients-slice';
import { builderInitialState } from './slices/builder-slice';

describe('rootReducer (unit)', () => {
  test('должен возвращать initial state при неизвестном экшене', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };

    const state = rootReducer(undefined, unknownAction);

    expect(state).toEqual({
      user: userInitialState,
      feed: feedsInitialState,
      orders: ordersInitialState,
      ingredients: ingredientsInitialState,
      builderBurger: builderInitialState,
    });
  });
});