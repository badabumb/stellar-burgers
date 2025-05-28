import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { RootState, useSelector } from '../../services/store';

const INGREDIENT_LIMIT = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const currentLocation = useLocation();
  const ingredientPool = useSelector(
    (state: RootState) => state.ingredients.items
  );

  const processedOrder = useMemo(() => {
    if (!ingredientPool.length) return null;

    const detailedIngredients = order.ingredients.reduce((acc: TIngredient[], id: string) => {
      const match = ingredientPool.find((item) => item._id === id);
      return match ? [...acc, match] : acc;
    }, []);

    const cost = detailedIngredients.reduce((sum, el) => sum + el.price, 0);
    const visibleIngredients = detailedIngredients.slice(0, INGREDIENT_LIMIT);
    const hiddenCount =
      detailedIngredients.length > INGREDIENT_LIMIT
        ? detailedIngredients.length - INGREDIENT_LIMIT
        : 0;

    const timestamp = new Date(order.createdAt);

    return {
      ...order,
      ingredientsInfo: detailedIngredients,
      ingredientsToShow: visibleIngredients,
      remains: hiddenCount,
      total: cost,
      date: timestamp
    };
  }, [order, ingredientPool]);

  if (!processedOrder) return null;

  return (
    <OrderCardUI
      orderInfo={processedOrder}
      maxIngredients={INGREDIENT_LIMIT}
      locationState={{ background: currentLocation }}
    />
  );
});