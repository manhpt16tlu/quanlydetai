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

const getAll = () => {};
const getAllNoPaging = () => {
  return call('GET', `topic/nopaging`);
};
const getApproved = (page, size) => {
  return call('GET', `topic/approved?page=${page}&size=${size}`);
};
const getFilteredApproved = (name, organ, manager, page, size) => {
  return call(
    'GET',
    `topic/approved/filtered?page=${page}&size=${size}&name=${encodeURI(
      name ?? ''
    )}&organ=${encodeURI(organ ?? '')}&manager=${encodeURI(manager ?? '')}`
  );
};
const create = (body, organId, fieldId, statusId, resultId) => {
  return call(
    'POST',
    `organ/${organId}/field/${fieldId}/status/${statusId}/result/${resultId}/topic`,
    body
  );
};
const getById = (id) => {
  return call('GET', `topic/${id}`);
};
const update = (body, topicId) => {
  return call('PUT', `topic/${topicId}`, body);
};
const getNonApprovedByOrganId = (organId) => {
  return call('GET', `organ/${organId}/topic/not_approved`);
};
export {
  getAllNoPaging,
  getById,
  create,
  update,
  getApproved,
  getFilteredApproved,
  getNonApprovedByOrganId,
};
