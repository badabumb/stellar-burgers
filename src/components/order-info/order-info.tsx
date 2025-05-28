import { FC, useEffect, useMemo, useState } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import { fetchOrderByNumber } from '../../services/slices/orders-slice';

export const OrderInfo: FC = () => {
  const { number: orderId } = useParams<{ number: string }>();
  const send = useDispatch();

  const [selectedOrder, setSelectedOrder] = useState<TOrder | null>(null);

  const allIngredients: TIngredient[] = useSelector(
    (state: RootState) => state.ingredients.items
  );

  useEffect(() => {
    send(fetchOrderByNumber(Number(orderId)))
      .unwrap()
      .then((result) => {
        setSelectedOrder(result[0] ?? null);
      })
      .catch((err) => {
        console.error('Ошибка получения заказа:', err);
      });
  }, [send, orderId]);

  const composedOrder = useMemo(() => {
    if (!selectedOrder || !allIngredients.length) return null;

    const createdDate = new Date(selectedOrder.createdAt);

    const grouped: Record<string, TIngredient & { count: number }> = {};

    selectedOrder.ingredients.forEach((id) => {
      if (!grouped[id]) {
        const match = allIngredients.find((i) => i._id === id);
        if (match) {
          grouped[id] = { ...match, count: 1 };
        }
      } else {
        grouped[id].count++;
      }
    });

    const sum = Object.values(grouped).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...selectedOrder,
      ingredientsInfo: grouped,
      date: createdDate,
      total: sum
    };
  }, [selectedOrder, allIngredients]);

  if (!composedOrder) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={composedOrder} />;
};