import api from 'configs/api';
const call = async function (method, url, body) {
  switch (method) {
    case 'GET': {
      const data = await api.get(url).catch((err) => console.log(err));
      return data.data;
      break;
    }
    case 'POST': {
      const data = await api.post(url, body).catch((err) => console.log(err));
      return data.data;
      break;
    }
    case 'PUT': {
      const data = await api.put(url, body).catch((err) => console.log(err));
      return data;
      break;
    }
    default:
      break;
  }
  // if (method === 'GET') {
  //   const data = await api.get(url).catch((err) => console.log(err));
  //   return data.data;
  // } else if (method === 'POST') {
  //   const data = await api.post(url, body).catch((err) => console.log(err));
  //   return data.data;
  // } else if (method === 'PUT') {
  // }
};
const getAll = (page) => {
  return call('GET', `organ?page=${page}`);
};
const create = (body) => {
  return call('POST', 'organ', body);
};
const update = (body, organId) => {
  return call('PUT', `organ/${organId}`, body);
};
export { getAll, create, update };
