import api from 'configs/api';
const call = async function (method, url, body, config) {
  let ret;
  switch (method) {
    case 'POST': {
      const axiosResponse = await api.post(url, body, config);
      ret = axiosResponse.data;
      break;
    }
    case 'GET': {
      const axiosResponse = config
        ? await api.get(url, config)
        : await api.get(url);
      ret = axiosResponse.data;
      break;
    }
    case 'GET_FILE': {
      const axiosResponse = config
        ? await api.get(url, config)
        : await api.get(url);
      ret = axiosResponse;
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
const download = (fileCode, config) => {
  return call('GET_FILE', `download/${fileCode}`, null, config);
};
const getFilesOfTopic = (topicId) => {
  return call('GET', `file/topic/${topicId}`);
};
const getFilesByType = (fileTypeName) => {
  return call('GET', `file/type/${encodeURI(fileTypeName)}`);
};
export { upload, download, getFilesOfTopic, getFilesByType };
