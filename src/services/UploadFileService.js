import api from 'configs/api';

//handle all file logic,include topic file and form file

const call = async function (method, url, body, config) {
  let ret;
  switch (method) {
    case 'POST': {
      const axiosResponse = config
        ? await api.post(url, body, config)
        : await api.post(url, body);
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
    case 'DELETE': {
      const axiosResponse = await api.delete(url);
      ret = axiosResponse.data;
    }
    default:
      break;
  }
  return ret;
};
const uploadTopicFile = (body, config) => {
  return call('POST', 'upload/topic', body, config);
};
const uploadFormFile = (body, config) => {
  return call('POST', 'upload/form', body, config);
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

const createForm = (body) => {
  return call('POST', 'form', body);
};

const getAllFormType = () => {
  return call('GET', 'formType');
};
const deleteForm = (formId) => {
  return call('DELETE', `form/${formId}`);
};
const getAllForm = (page, size) => {
  return call('GET', `form?page=${page}&size=${size}`);
};

export {
  getAllForm,
  deleteForm,
  createForm,
  uploadTopicFile,
  uploadFormFile,
  download,
  getAllFormType,
  getTopicFilesByTopicIdAndTopicFileType,
};
