import api from 'configs/api';
const call = async function (method, url, body, config) {
  let ret;
  switch (method) {
    case 'POST': {
      const data = await api.post(url, body, config);
      ret = data.data;
      break;
    }
    case 'GET': {
      const data = await api.get(url);
      ret = data.data;
      break;
    }
    default:
      break;
  }
  return ret;
};
const upload = (body, config) => {
  return call('POST', 'upload', body, config);
};
const download = (fileCode) => {
  return call('GET', `download/${fileCode}`);
};
const getFilesOfTopic = (topicId) => {
  return call('GET', `file/topic/${topicId}`);
};
export { upload, download, getFilesOfTopic };
