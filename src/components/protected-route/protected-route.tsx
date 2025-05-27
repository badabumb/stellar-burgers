import React, { FC, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector, RootState } from '../../services/store';
import { fetchUser } from '../../services/slices/user-slice';

type RouteProps = {
  children: React.ReactNode;
};

/**
 * Приватный маршрут: открыт только для авторизованных юзеров.
 * Проверка токена и загрузка профиля при первом рендере.
 * Если юзер не вошёл — редирект на страницу логина.
 */
export const ProtectedRoute: FC<RouteProps> = ({ children }) => {
  const dispatchFn = useDispatch();
  const routeLocation = useLocation();
  const { user: currentUser, loading: isUserLoading } = useSelector(
    (state: RootState) => state.user
  );

  const tokenExists = document.cookie
    .split('; ')
    .some((cookie) => cookie.startsWith('accessToken='));

  useEffect(() => {
    if (tokenExists && !currentUser && !isUserLoading) {
      dispatchFn(fetchUser());
    }
  }, [dispatchFn, currentUser, isUserLoading, tokenExists]);

  if (isUserLoading || (tokenExists && !currentUser)) {
    return null;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: routeLocation }} replace />;
  }

  return <>{children}</>;
};

/**
 * Открытый маршрут: доступен только неавторизованным пользователям.
 * Если есть токен и нет данных о пользователе — грузим профиль.
 * Если авторизован — редирект на главную.
 */
export const PublicRoute: FC<RouteProps> = ({ children }) => {
  const dispatchFn = useDispatch();
  const { user: activeUser, loading: userPending } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    const tokenDetected = document.cookie
      .split('; ')
      .some((cookie) => cookie.startsWith('accessToken='));
    if (tokenDetected && !activeUser && !userPending) {
      dispatchFn(fetchUser());
    }
  }, [dispatchFn, activeUser, userPending]);

  if (userPending) {
    return null;
  }

  if (activeUser) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};