import axiosMakeRequest from 'services/BaseService';

const getAll = () => {
  return axiosMakeRequest('GET', `userRank`);
};
export { getAll };
