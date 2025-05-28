import React, { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useDispatch, useSelector, RootState } from '../../services/store';
import { fetchFeed } from '../../services/slices/feeds-slice';

export const Feed: FC = () => {
  const send = useDispatch();
  const { orders: feedOrders, loading: isLoading, error: feedError } = useSelector(
    (state: RootState) => state.feed
  );

  useEffect(() => {
    send(fetchFeed());
  }, [send]);

  if (feedError) {
    return <p className="text text_type_main-default">Ошибка: {feedError}</p>;
  }

  return (
    <FeedUI
      orders={feedOrders}
      handleGetFeeds={() => send(fetchFeed())}
    />
  );
};