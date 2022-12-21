import axios from 'axios';
import { LOCALSTORAGE_KEY } from './general';
const api = axios.create({
  baseURL: 'http://localhost:8082/api',
});
api.interceptors.request.use(function (config) {
  const user = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY.currentUser));
  const token = user?.accessToken;
  const type = user?.type;
  if (token) config.headers['Authorization'] = `${type} ${token}`;
  return config;
});
export default api;
