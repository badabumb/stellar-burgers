import React, { FC, useMemo } from 'react';
import store, {
  RootState,
  useDispatch,
  useSelector
} from '../../services/store';
import { TBuilderIngredient } from '../../utils/types';
import { BurgerBuilderUI } from '../ui/burger-builder';
import {
  createOrder,
  clearCurrentOrder
} from '../../services/slices/orders-slice';
import { useNavigate } from 'react-router-dom';
import { clearBuilder } from '../../services/slices/builder-slice';

export const BurgerBuilder: FC = () => {
  const send = useDispatch();
  const goTo = useNavigate();

  const items = useSelector((state) => state.builderBurger);
  const isLoading = useSelector((state) => state.orders.loading);
  const orderData = useSelector((state) => state.orders.currentOrder);
  const userInfo = useSelector((state: RootState) => state.user.user);

  console.log('Builder state snapshot:', store.getState());

  const handleOrder = () => {
    if (!items.bun || isLoading) return;

    if (!userInfo) {
      goTo('/login', { replace: true });
      return;
    }

    const fillings = items.ingredients.map((el) => el._id);
    const fullIngredientList = [
      items.bun._id,
      ...fillings,
      items.bun._id
    ];

    send(createOrder(fullIngredientList)).then((action) => {
      if (createOrder.fulfilled.match(action)) {
        send(clearBuilder());
      }
    });
  };

  const dismissModal = () => {
    send(clearCurrentOrder());
  };

  const totalPrice = useMemo(() => {
    const bunCost = items.bun ? items.bun.price * 2 : 0;
    const fillingCost = items.ingredients.reduce(
      (sum: number, item: TBuilderIngredient) => sum + item.price,
      0
    );
    return bunCost + fillingCost;
  }, [items]);

  return (
    <BurgerBuilderUI
      price={totalPrice}
      orderRequest={isLoading}
      builderItems={items}
      orderModalData={orderData}
      onOrderClick={handleOrder}
      closeOrderModal={dismissModal}
    />
  );
};