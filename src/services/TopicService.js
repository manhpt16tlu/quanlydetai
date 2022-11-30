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
    case 'PATCH': {
      const data = await api.patch(url, body);
      ret = data.data;
      break;
    }
    case 'DELETE': {
      const data = await api.delete(url);
      ret = data.data;
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
const getFilteredApproved = (name, organ, manager, status, page, size) => {
  const organUrlPart = organ?.join(',');
  return call(
    'GET',
    `topic/approved/filtered?page=${page}&size=${size}&name=${encodeURI(
      name ?? ''
    )}&organ=${encodeURI(organUrlPart ?? '')}&manager=${encodeURI(
      manager ?? ''
    )}&status=${encodeURI(status ?? '')}`
  );
};
const create = (body, organId, fieldId, statusId, resultId) => {
  const resultUrlPart = resultId ? `/result/${resultId}` : '';
  return call(
    'POST',
    `organ/${organId}/field/${fieldId}/status/${statusId}${resultUrlPart}/topic`,
    body
  );
};
const getById = (id) => {
  return call('GET', `topic/${id}`);
};
const update = (body, topicId) => {
  return call('PUT', `topic/${topicId}`, body);
};
const approve = (topicId, body) => {
  //special update method
  return call('PATCH', `approve_topic/${topicId}`, body);
};
const getNonApprovedByOrganId = (organId) => {
  return call('GET', `organ/${organId}/topic/not_approved`);
};
const deleteById = (topicId) => {
  return call('DELETE', `topic/${topicId}`);
};
export {
  approve,
  getAllNoPaging,
  getById,
  create,
  update,
  getApproved,
  getFilteredApproved,
  getNonApprovedByOrganId,
  deleteById,
};
