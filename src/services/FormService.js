import api from 'configs/api';

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
    default:
      break;
  }
  return ret;
};

const existByFormName = (formName) => {
  return call('GET', `form/existByName?name=${encodeURI(formName)}`);
};
const getFormById = (formId) => {
  return call('GET', `form/${formId}`);
};
const getFormFileByFormId = (formId) => {
  return call('GET', `formFile/${formId}`);
};
const getAllFormType = () => {
  return call('GET', `formType`);
};
export { getAllFormType, existByFormName, getFormById, getFormFileByFormId };
