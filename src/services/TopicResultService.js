import api from 'configs/api';
const call = async function (method, url, body) {
  let ret;
  switch (method) {
    case 'GET': {
      const axiosResponse = await api.get(url);
      ret = axiosResponse.data;
      break;
    }
    case 'POST': {
      const axiosResponse = await api.post(url, body);
      ret = axiosResponse.data;
      break;
    }
    case 'PUT': {
      const data = await api.put(url, body);
      break;
    }
    default:
      break;
  }
  return ret;
};
const getAll = () => {
  return call('GET', `result`);
};
const create = (body) => {
  return call('POST', 'organ', body);
};
const update = (body, organId) => {
  return call('PUT', `organ/${organId}`, body);
};
const getById = (id) => {
  return call('GET', `result/${id}`);
};

export { getAll, create, update, getById };
