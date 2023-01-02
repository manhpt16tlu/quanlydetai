import api from 'configs/api';

const call = async function (method, url, body, config) {
  let ret;
  //prettier-ignore
  switch (method) {
    case 'GET': {
      const axiosResponse = config ? await api.get(url, config) : await api.get(url);
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
      const axiosResponse = body ? await api.patch(url, body) : await api.patch(url);
      ret = axiosResponse.data;
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

export default call;
