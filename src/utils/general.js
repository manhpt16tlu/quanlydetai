import { notification } from 'antd';
const openNotificationWithIcon = (type, action, placement) => {
  notification[type]({
    message: `${capitalizeFirstLetter(type)}`,
    description: action
      ? `${action} ${notifiTypes[type]}`
      : type === 'error'
      ? 'Có lỗi xảy ra'
      : '',
    placement,
    duration: 2.5, // default close after 2.5
  });
};
const notifiTypes = {
  success: 'thành công',
  error: 'không thành công',
};
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
const uid = () =>
  String(Date.now().toString(32) + Math.random().toString(16)).replace(
    /\./g,
    ''
  );
export { openNotificationWithIcon, capitalizeFirstLetter, uid };
