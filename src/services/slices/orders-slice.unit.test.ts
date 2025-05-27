import { configureStore } from '@reduxjs/toolkit';
import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import {
  ordersReducer,
  fetchOrders,
  createOrder,
  fetchOrderByNumber,
  clearCurrentOrder
} from './orders-slice';

import * as api from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

const initStore = () =>
  configureStore({
    reducer: {
      orders: ordersReducer,
    },
  });

const demoOrder: TOrder = {
  _id: 'demo1',
  status: 'done',
  name: 'Марсианский бургер',
  createdAt: '2025-05-26T12:00:00.000Z',
  updatedAt: '2025-05-26T12:05:00.000Z',
  ingredients: ['id1', 'id2'],
  number: 88191,
};

describe('orders slice full test suite', () => {
  let store: ReturnType<typeof initStore>;

  beforeEach(() => {
    store = initStore();
  });

  describe('fetchOrders thunk', () => {
    test('проверка pending состояния', () => {
      store.dispatch({ type: fetchOrders.pending.type });
      const state = store.getState().orders;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('успешный fetch записывает заказы', () => {
      store.dispatch({ type: fetchOrders.fulfilled.type, payload: [demoOrder] });
      const state = store.getState().orders;
      expect(state.loading).toBe(false);
      expect(state.orders).toEqual([demoOrder]);
    });

    test('ошибка fetchOrders с сообщением', () => {
      store.dispatch({ type: fetchOrders.rejected.type, payload: 'Ошибка загрузки' });
      const state = store.getState().orders;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка загрузки');
    });

    test('ошибка fetchOrders без payload', () => {
      store.dispatch({ type: fetchOrders.rejected.type });
      const state = store.getState().orders;
      expect(state.error).toBe('Ошибка при получении заказов');
    });
  });

  describe('createOrder thunk', () => {
    test('pending выставляет loading', () => {
      store.dispatch({ type: createOrder.pending.type });
      const state = store.getState().orders;
      expect(state.loading).toBe(true);
    });

    test('fulfilled добавляет заказ и currentOrder', () => {
      store.dispatch({
        type: createOrder.fulfilled.type,
        payload: { order: demoOrder, name: 'Готово' },
      });
      const state = store.getState().orders;
      expect(state.loading).toBe(false);
      expect(state.orders[0]).toEqual(demoOrder);
      expect(state.currentOrder).toEqual(demoOrder);
    });

    test('ошибка создания заказа с сообщением', () => {
      store.dispatch({ type: createOrder.rejected.type, payload: 'Ошибка оформления' });
      const state = store.getState().orders;
      expect(state.error).toBe('Ошибка оформления');
    });

    test('ошибка создания заказа без payload', () => {
      store.dispatch({ type: createOrder.rejected.type });
      const state = store.getState().orders;
      expect(state.error).toBe('Ошибка при создании заказа');
    });
  });

  describe('поиск заказа по номеру', () => {
    test('pending обнуляет ошибку', () => {
      store.dispatch({ type: fetchOrderByNumber.pending.type });
      expect(store.getState().orders.error).toBeNull();
    });

    test('успешный fetchOrderByNumber не меняет currentOrder', () => {
      store.dispatch({ type: fetchOrderByNumber.fulfilled.type, payload: [demoOrder] });
      const state = store.getState().orders;
      expect(state.currentOrder).toBeNull(); // соответствует логике
    });

    test('ошибка поиска заказа по номеру', () => {
      store.dispatch({ type: fetchOrderByNumber.rejected.type, payload: 'Not found' });
      expect(store.getState().orders.error).toBe('Not found');
    });

    test('fetchOrderByNumber без payload', () => {
      store.dispatch({ type: fetchOrderByNumber.rejected.type });
      expect(store.getState().orders.error).toBe('Ошибка получения заказа по номеру');
    });
  });

  describe('очистка текущего заказа', () => {
    test('clearCurrentOrder работает корректно', () => {
      store.dispatch({ type: createOrder.fulfilled.type, payload: { order: demoOrder, name: 'Test' } });
      expect(store.getState().orders.currentOrder).toEqual(demoOrder);

      store.dispatch(clearCurrentOrder());
      expect(store.getState().orders.currentOrder).toBeNull();
    });
  });

  describe('реальные ошибки API моками', () => {
    test('thunk fetchOrders ловит ошибку', async () => {
      jest.spyOn(api, 'getOrdersApi').mockRejectedValueOnce(new Error('network fail'));
      await store.dispatch(fetchOrders());
      expect(store.getState().orders.error).toBe('network fail');
    });

    test('createOrder ловит ошибку при фейле', async () => {
      jest.spyOn(api, 'orderBurgerApi').mockRejectedValueOnce(new Error('order failed'));
      await store.dispatch(createOrder(['a', 'b']));
      expect(store.getState().orders.error).toBe('order failed');
    });

    test('fetchOrderByNumber ловит ошибку', async () => {
      jest.spyOn(api, 'getOrderByNumberApi').mockRejectedValueOnce(new Error('not found'));
      await store.dispatch(fetchOrderByNumber(88191));
      expect(store.getState().orders.error).toBe('not found');
    });
  });
});