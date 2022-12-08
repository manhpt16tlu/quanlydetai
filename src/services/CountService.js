import api from 'configs/api';
const call = async function (method, url, body) {
  let ret;
  switch (method) {
    case 'GET': {
      const data = await api.get(url);
      ret = data.data;
      break;
    }
  }
  return ret;
};
const countTopicByStatusId = (organId, statusId) => {
  return call(
    'GET',
    `count/topic/by/status?organId=${organId}&statusId=${statusId}`
  );
};
const countTopicByStatusName = (organId, statusName) => {
  return call(
    'GET',
    `count/topic/by/status_name?organId=${organId}&statusName=${statusName}`
  );
};
const countTopicByName = (name) => {
  return call('GET', `count/topic/by/name?name=${encodeURI(name)}`);
};

const countFormByName = (name) => {
  return call('GET', `count/form/byName?name=${encodeURI(name)}`);
};
export {
  countFormByName,
  countTopicByStatusId,
  countTopicByName,
  countTopicByStatusName,
};
