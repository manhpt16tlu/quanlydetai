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
const uploadTopicFile = (body, config) => {
  return call('POST', 'upload/topic', body, config);
};
const download = (fileType, fileCode, config) => {
  return call('GET_FILE', `download/${fileType}/${fileCode}`, null, config);
};
const getTopicFilesByTopicIdAndTopicFileType = (topicId, topicFileType) => {
  return call(
    'GET',
    `topicFile/topicId/${topicId}/topicFileType/${encodeURI(topicFileType)}`
  );
};
const getFilesByType = (fileTypeName) => {
  return call('GET', `file/type/${encodeURI(fileTypeName)}`);
};
export {
  uploadTopicFile,
  download,
  getTopicFilesByTopicIdAndTopicFileType,
  getFilesByType,
};
