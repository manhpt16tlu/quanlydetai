import api from 'configs/api';
import { LOCALSTORAGE_KEY } from 'configs/general';

const login = async (username, password) => {
  const axiosResponse = await api.post('auth/login', {
    username,
    password,
  });
  return axiosResponse.data;
};
const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.accessToken)
    return {
      Authorization: `Bearer ${user.accessToken}`,
    };
  else return {};
};
const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY.currentUser));
};
const register = async (data) => {
  const axiosResponse = await api.post(`auth/signup`, data);
  return axiosResponse.data;
};
const logout = () => {
  localStorage.clear();
};
const checkExpiredToken = () => {
  const user = getCurrentUser();
  if (!user || new Date(user.expirationTime) < new Date()) return true;
  return false;
};
export {
  login,
  checkExpiredToken,
  register,
  logout,
  getCurrentUser,
  getAuthHeader,
};
