import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { Preloader } from '../../components/ui/preloader/preloader';
import { fetchOrders } from '../../services/slices/orders-slice';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredients-slice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(
    (state: RootState) => state.orders
  );

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading || orders.length === 0) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className='text text_type_main-default'>
        Ошибка загрузки заказов: {error}
      </p>
    );
  }

  return <ProfileOrdersUI orders={orders} />;
};
