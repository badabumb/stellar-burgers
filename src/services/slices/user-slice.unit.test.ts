import { userReducer, userInitialState, clearPasswordReset, registerUser, loginUser, logoutUser, fetchUser, updateUser, requestPasswordReset, resetPassword } from './user-slice';
import type { UserState } from './user-slice';

describe('userReducer logic and async cases', () => {
  let baseState: UserState;

  beforeEach(() => {
    baseState = { ...userInitialState };
  });

  test('возвращает начальное состояние при неизвестном action', () => {
    const result = userReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(result).toEqual(userInitialState);
  });

  test('clearPasswordReset сбрасывает флаг восстановления', () => {
    const preState: UserState = { ...baseState, passwordResetRequested: true };
    const updated = userReducer(preState, clearPasswordReset());
    expect(updated.passwordResetRequested).toBe(false);
  });

  describe('registerUser', () => {
    test('pending: loading true, error null', () => {
      const result = userReducer(baseState, { type: registerUser.pending.type });
      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    test('fulfilled: устанавливает user и снимает loading', () => {
      const fakeUser = { name: 'Alice', email: 'alice@space.com' };
      const action = {
        type: registerUser.fulfilled.type,
        payload: { user: fakeUser, accessToken: 'token', refreshToken: 'refresh' }
      };
      const result = userReducer(baseState, action);
      expect(result.user).toEqual(fakeUser);
      expect(result.loading).toBe(false);
    });

    test('rejected: error записывается, loading false', () => {
      const action = { type: registerUser.rejected.type, payload: 'reg failed' };
      const result = userReducer(baseState, action);
      expect(result.error).toBe('reg failed');
      expect(result.loading).toBe(false);
    });
  });

  describe('loginUser', () => {
    test('pending: включен loading, error сброшен', () => {
      const result = userReducer(baseState, { type: loginUser.pending.type });
      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    test('fulfilled: user записывается, loading false', () => {
      const payloadUser = { name: 'Bob', email: 'bob@space.com' };
      const action = {
        type: loginUser.fulfilled.type,
        payload: { user: payloadUser, accessToken: 'a', refreshToken: 'r' }
      };
      const result = userReducer(baseState, action);
      expect(result.user).toEqual(payloadUser);
      expect(result.loading).toBe(false);
    });

    test('rejected: записывает ошибку', () => {
      const result = userReducer(baseState, {
        type: loginUser.rejected.type,
        payload: 'login failed'
      });
      expect(result.error).toBe('login failed');
    });
  });

  describe('logoutUser', () => {
    test('pending: включается загрузка', () => {
      const result = userReducer(baseState, { type: logoutUser.pending.type });
      expect(result.loading).toBe(true);
    });

    test('fulfilled: очищает пользователя', () => {
      const pre = { ...baseState, user: { name: 'Mac', email: 'mac@os.com' } };
      const result = userReducer(pre, { type: logoutUser.fulfilled.type });
      expect(result.user).toBeNull();
      expect(result.loading).toBe(false);
    });

    test('rejected: пишет ошибку', () => {
      const result = userReducer(baseState, {
        type: logoutUser.rejected.type,
        payload: 'logout error'
      });
      expect(result.error).toBe('logout error');
    });
  });

  describe('fetchUser', () => {
    test('pending: loading true', () => {
      const result = userReducer(baseState, { type: fetchUser.pending.type });
      expect(result.loading).toBe(true);
    });

    test('fulfilled: user устанавливается', () => {
      const user = { name: 'Zorg', email: 'z@mars.com' };
      const result = userReducer(baseState, {
        type: fetchUser.fulfilled.type,
        payload: user
      });
      expect(result.user).toEqual(user);
      expect(result.loading).toBe(false);
    });

    test('rejected: error сохраняется', () => {
      const result = userReducer(baseState, {
        type: fetchUser.rejected.type,
        payload: 'fetch failed'
      });
      expect(result.error).toBe('fetch failed');
    });
  });

  describe('updateUser', () => {
    test('pending: активирует загрузку', () => {
      const result = userReducer(baseState, { type: updateUser.pending.type });
      expect(result.loading).toBe(true);
    });

    test('fulfilled: обновляет данные', () => {
      const updated = { name: 'Neo', email: 'neo@matrix.com' };
      const result = userReducer(baseState, {
        type: updateUser.fulfilled.type,
        payload: updated
      });
      expect(result.user).toEqual(updated);
    });

    test('rejected: сохраняет ошибку', () => {
      const result = userReducer(baseState, {
        type: updateUser.rejected.type,
        payload: 'update err'
      });
      expect(result.error).toBe('update err');
    });
  });

  describe('requestPasswordReset', () => {
    test('pending: loading активен', () => {
      const result = userReducer(baseState, { type: requestPasswordReset.pending.type });
      expect(result.loading).toBe(true);
    });

    test('fulfilled: флаг восстановления установлен', () => {
      const result = userReducer(baseState, { type: requestPasswordReset.fulfilled.type });
      expect(result.passwordResetRequested).toBe(true);
    });

    test('rejected: ошибка при запросе', () => {
      const result = userReducer(baseState, {
        type: requestPasswordReset.rejected.type,
        payload: 'reset err'
      });
      expect(result.error).toBe('reset err');
    });
  });

  describe('resetPassword', () => {
    test('pending: старт загрузки', () => {
      const result = userReducer(baseState, { type: resetPassword.pending.type });
      expect(result.loading).toBe(true);
    });

    test('fulfilled: сбрасывает флаг passwordResetRequested', () => {
      const pre = { ...baseState, passwordResetRequested: true };
      const result = userReducer(pre, { type: resetPassword.fulfilled.type });
      expect(result.passwordResetRequested).toBe(false);
    });

    test('rejected: записывает ошибку', () => {
      const result = userReducer(baseState, {
        type: resetPassword.rejected.type,
        payload: 'reset failed'
      });
      expect(result.error).toBe('reset failed');
    });
  });
});