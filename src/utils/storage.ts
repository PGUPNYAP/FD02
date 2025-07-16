import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export const storeUser = (user: object) => {
  storage.set('user', JSON.stringify(user));
};

export const getStoredUser = (): object | null => {
  const json = storage.getString('user');
  return json ? JSON.parse(json) : null;
};

export const clearUser = () => {
  storage.delete('user');
};
