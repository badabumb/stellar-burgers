import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from './slices/ingredients-slice';
import { feedReducer } from './slices/feeds-slice';
import { ordersReducer } from './slices/orders-slice';
import { userReducer } from './slices/user-slice';
import { builderReducer } from './slices/builder-slice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  feed: feedReducer,
  orders: ordersReducer,
  user: userReducer,
  builderBurger: builderReducer
});

export type RootState = ReturnType<typeof rootReducer>;
