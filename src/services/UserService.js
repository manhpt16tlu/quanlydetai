import api from 'configs/api';
import { REQUEST_METHOD_NAME } from 'configs/general';
const call = async function (method, url, body, config) {
  let ret;
  switch (method) {
    case 'POST': {
      const axiosResponse = config
        ? await api.post(url, body, config)
        : await api.post(url, body);
      ret = axiosResponse.data;
      break;
    }
    case 'GET': {
      const axiosResponse = config
        ? await api.get(url, config)
        : await api.get(url);
      ret = axiosResponse.data;
      break;
    }
    case 'PATCH': {
      const axiosResponse = await api.patch(url, body, config);
      ret = axiosResponse.data;
      break;
    }
    default:
      break;
  }
  return ret;
};
const getUserByUsername = (username) => {
  return call('GET', `user/${username}`);
};
const existByUserName = (username) => {
  return call('GET', `user/existByUsername/${username}`);
};
const getAllUser = (page, size, params) => {
  return call('GET', `user?page=${page}&size=${size}`, null, { params });
};
const disableUser = (userId) => {
  return call('PATCH', `user/disable/${userId}`, null);
};
const updateInformation = (userId, body) => {
  return call(REQUEST_METHOD_NAME.patch, `user/${userId}`, body);
};
const changePassword = (params) => {
  return call(REQUEST_METHOD_NAME.patch, `user/changepassword`, null, {
    params,
  });
};
export {
  changePassword,
  updateInformation,
  getUserByUsername,
  existByUserName,
  getAllUser,
  disableUser,
};
