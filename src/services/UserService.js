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
export { getUserByUsername, existByUserName };
