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
const countTopicByStatus = (organId, statusId) => {
  return call(
    'GET',
    `count/topic/by/status?organId=${organId}&statusId=${statusId}`
  );
};
const countTopicByName = (name) => {
  return call('GET', `count/topic/by/name?name=${encodeURI(name)}`);
};

export { countTopicByStatus, countTopicByName };
