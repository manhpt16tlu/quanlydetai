import axios from 'axios';
import { LOCALSTORAGE_KEY } from './general';

const api = axios.create({
  baseURL: 'http://localhost:8082/api',
});

//custom request
api.interceptors.request.use(function (config) {
  const user = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY.currentUser));
  const token = user?.accessToken;
  const type = user?.type;
  if (token) config.headers['Authorization'] = `${type} ${token}`;
  return config;
});

//custom response
api.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    if (error.response.status === 401)
      if (localStorage.getItem(LOCALSTORAGE_KEY.currentUser) !== null)
        localStorage.removeItem(LOCALSTORAGE_KEY.currentUser);
    // Any status codes that falls OUTSIDE the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default api;
