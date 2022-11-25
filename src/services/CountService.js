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

export { countTopicByStatusId, countTopicByName, countTopicByStatusName };
