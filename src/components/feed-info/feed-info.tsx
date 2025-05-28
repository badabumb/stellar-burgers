import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector, RootState } from '../../services/store';
import { fetchFeed } from '../../services/slices/feeds-slice';
import { FeedInfoUI } from '../ui/feed-info';
import { TOrder } from '../../utils/types';

const extractOrderNumbers = (list: TOrder[], matchStatus: string): number[] => list
    .filter((order) => order.status === matchStatus)
    .map((order) => order.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const dispatchFeed = useDispatch();
  const { orders, total, totalToday, loading: isLoading, error: fetchError } = useSelector(
    (state: RootState) => state.feed
  );

  useEffect(() => {
    dispatchFeed(fetchFeed());
  }, [dispatchFeed]);

  if (isLoading) {
    return <p className='text text_type_main-default'>Загрузка...</p>;
  }

  if (fetchError) {
    return <p className='text text_type_main-default'>Ошибка: {fetchError}</p>;
  }

  const doneList = extractOrderNumbers(orders, 'done');
  const pendingList = extractOrderNumbers(orders, 'pending');
  const feedSummary = { total, totalToday };

  return (
    <FeedInfoUI
      readyOrders={doneList}
      pendingOrders={pendingList}
      feed={feedSummary}
    />
  );
};