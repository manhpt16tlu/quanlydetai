import api from 'configs/api';
const call = async function (method, url, body, config) {
  let ret;
  switch (method) {
    case 'GET': {
      const axiosResponse = config
        ? await api.get(url, config)
        : await api.get(url);
      ret = axiosResponse.data;
      break;
    }
    case 'POST': {
      const axiosResponse = await api.post(url, body);
      ret = axiosResponse.data;
      break;
    }
    case 'PUT': {
      const axiosResponse = await api.put(url, body);
      ret = axiosResponse;
      break;
    }
    case 'PATCH': {
      const data = body ? await api.patch(url, body) : await api.patch(url);
      ret = data.data;
      break;
    }
    case 'DELETE': {
      const axiosResponse = await api.delete(url);
      ret = axiosResponse.data;
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
const getFilteredApproved = (
  name,
  organ,
  manager,
  status,
  page,
  size,
  config
) => {
  const organUrlPart = organ?.join(',');
  return call(
    'GET',
    `topic/approved/filtered?page=${page}&size=${size}&name=${encodeURI(
      name ?? ''
    )}&organ=${encodeURI(organUrlPart ?? '')}&manager=${encodeURI(
      manager ?? ''
    )}&status=${encodeURI(status ?? '')}`,
    null,
    config
  );
};

const getAllByUsernameWithFilter = (username, page, size, params) => {
  return call(
    'GET',
    `topic/getAllByUser/${username}?page=${page}&size=${size}`,
    undefined,
    {
      params,
    }
  );
};

const getAllByAdminWithFilter = (page, size, params) => {
  return call(
    'GET',
    `topic/adminGetTopics/?page=${page}&size=${size}`,
    undefined,
    {
      params,
    }
  );
};

const getNotApproveTopicList = (page, size, params) => {
  return call(
    'GET',
    `topic/adminGetTopics/not_approved/?page=${page}&size=${size}`,
    undefined,
    {
      params,
    }
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
const employeeCreate = (body) => {
  return call('POST', `topic/employeeCreate`, body);
};
const getById = (id) => {
  return call('GET', `topic/${id}`);
};
const update = (body, topicId) => {
  return call('PUT', `topic/${topicId}`, body);
};
const approve = (topicId) => {
  return call('PATCH', `approve_topic/${topicId}`, null);
};
const getNonApprovedByOrganId = (organId) => {
  return call('GET', `organ/${organId}/topic/not_approved`);
};
const deleteById = (topicId) => {
  return call('DELETE', `topic/${topicId}`);
};

const existByName = (topicName) => {
  return call('GET', `topic/existByName?name=${encodeURI(topicName)}`);
};
export {
  getNotApproveTopicList,
  getAllByAdminWithFilter,
  getAllByUsernameWithFilter,
  employeeCreate,
  existByName,
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
