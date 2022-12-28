import api from 'configs/api';
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
      const data = body ? await api.patch(url, body) : await api.patch(url);
      ret = data.data;
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
export { getUserByUsername, existByUserName, getAllUser, disableUser };
