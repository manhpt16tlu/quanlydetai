import { REQUEST_METHOD_NAME } from 'configs/general';
import axiosMakeRequest from 'services/BaseService';

const getAvatarFileOfCurrentUser = () => {
  return axiosMakeRequest(REQUEST_METHOD_NAME.get, `userAvatar/currentUser`);
};
const getAvatarFileOfUser = (username) => {
  return axiosMakeRequest(REQUEST_METHOD_NAME.get, `userAvatar/${username}`);
};
const removeAvatar = () => {
  return axiosMakeRequest(REQUEST_METHOD_NAME.delete, `delete/avatar`);
};

export { getAvatarFileOfCurrentUser, removeAvatar, getAvatarFileOfUser };
