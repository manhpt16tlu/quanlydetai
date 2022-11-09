import api from 'configs/api';
const call = async function (method, url, body) {
  let ret;
  switch (method) {
    case 'GET': {
      const data = await api.get(url).catch((err) => console.log(err));
      ret = data.data;
      break;
    }
    case 'POST': {
      const data = await api.post(url, body).catch((err) => console.log(err));
      ret = data.data;
      break;
    }
    case 'PUT': {
      const data = await api.put(url, body).catch((err) => console.log(err));
      ret = data;
      break;
    }
    default:
      break;
  }
  return ret;
};
const getAll = (page, search) => {
  return call('GET', `organ?page=${page}&search=${search}`);
};
const create = (body) => {
  return call('POST', 'organ', body);
};
const update = (body, organId) => {
  return call('PUT', `organ/${organId}`, body);
};
export { getAll, create, update };
