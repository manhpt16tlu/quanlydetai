import { notification } from 'antd';
const openNotificationWithIcon = (type, action, placement) => {
  notification[type]({
    message: `${capitalizeFirstLetter(type)}`,
    description: `${action} ${notifiTypes[type]}`,
    placement,
    duration: 2.5, // default close after 1.5
  });
};
const notifiTypes = {
  success: 'Thành công',
  error: 'Không thành công',
};
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
export { openNotificationWithIcon, capitalizeFirstLetter };
