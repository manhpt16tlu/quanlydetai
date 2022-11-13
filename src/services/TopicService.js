import api from 'configs/api';
const call = async function (method, url, body) {
  let ret;
  switch (method) {
    case 'GET': {
      const data = await api.get(url);
      ret = data.data;
      break;
    }
    case 'POST': {
      const data = await api.post(url, body);
      ret = data.data;
      break;
    }
    case 'PUT': {
      const data = await api.put(url, body);
      ret = data;
      break;
    }
    default:
      break;
  }
  return ret;
};
const getAll = () => {
  return call('GET', `topic`);
};
const create = (body, organId, fieldId, statusId, resultId) => {
  return call(
    'POST',
    `organ/${organId}/field/${fieldId}/status/${statusId}/result/${resultId}/topic`,
    body
  );
};
const update = (body, organId) => {
  return call('PUT', `topic/${organId}`, body);
};

export { getAll, create, update };
