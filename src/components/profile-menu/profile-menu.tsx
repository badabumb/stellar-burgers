import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { logoutUser } from '../../services/slices/user-slice';
import { clearBuilder } from '../../services/slices/builder-slice';

export const ProfileMenu: FC = () => {
  const location = useLocation();
  const navigateTo = useNavigate();
  const dispatchAction = useDispatch();
  const currentPath = location.pathname;

  const onLogout = () => {
    dispatchAction(logoutUser()).then((result) => {
      if ('error' in result) return;

      dispatchAction(clearBuilder());
      localStorage.removeItem('refreshToken');
      document.cookie = 'accessToken=; path=/; max-age=0';
      console.log('User session cleared');
      navigateTo('/login', { replace: true });
    });
  };

  return <ProfileMenuUI handleLogout={onLogout} pathname={currentPath} />;
};