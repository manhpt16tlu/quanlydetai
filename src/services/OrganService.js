import api from 'configs/api';
const call = async function (method, url, body, config) {
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
const getAll = (page, search) => {
  return call('GET', `organ?page=${page}&search=${search}`);
};
const getAllWithFilter = (page, size) => {
  return call('GET', `organ?page=${page}&size=${size}`);
};
const getAllNoPaging = () => {
  return call('GET', `organ/nopaging`);
};
const getAllWhichNeedApprove = () => {
  return call('GET', `organ/need_approve`);
};
const create = (body) => {
  return call('POST', 'organ', body);
};
const update = (organId, body) => {
  return call('PUT', `organ/${organId}`, body);
};
const existByName = (organName) => {
  return call('GET', `organ/existByName/${encodeURI(organName)}`);
};
export {
  getAllWithFilter,
  existByName,
  getAll,
  getAllNoPaging,
  create,
  update,
  getAllWhichNeedApprove,
};
