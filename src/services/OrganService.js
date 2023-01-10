import api from 'configs/api';
const call = async function (method, url, body, config) {
  let ret;
  switch (method) {
    case 'GET': {
      const axiosResponse = await api.get(url, config);
      ret = axiosResponse.data;
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
// const getAll = (page, search) => {
//   return call('GET', `organ?page=${page}&search=${search}`);
// };
const getAllWithFilter = (page, size, params) => {
  return call('GET', `organ?page=${page}&size=${size}`, null, { params });
};
const getAllNoPaging = () => {
  return call('GET', `organ/nopaging`);
};
// const getAllWhichNeedApprove = () => {
//   return call('GET', `organ/need_approve`);
// };
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
  // getAll,
  getAllNoPaging,
  create,
  update,
  // getAllWhichNeedApprove,
};
