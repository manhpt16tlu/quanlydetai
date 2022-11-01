import api from 'configs/api';
const call = async function (method, url) {
  if (method === 'GET') {
    const data = await api.get(url).catch((err) => console.log(err));
    return data.data;
  }
};
const getAll = () => {
  return call('GET', 'organ');
};
export { getAll };
