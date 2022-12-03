import { notification } from 'antd';
const openNotificationWithIcon = (type, action, placement, mess) => {
  notification[type]({
    message: `${capitalizeFirstLetter(type)}`,
    description: mess
      ? mess
      : action
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
//get filename from header
const getFileNameFromHeaderDisposition = (disposition) => {
  //áp dụng cho disposition có dạng: attachment; filename="SdsXQoJB-topic.xlsx"
  let filename = '';
  if (disposition && disposition.indexOf('attachment') !== -1) {
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = filenameRegex.exec(disposition);
    if (matches != null && matches[1]) {
      filename = matches[1].replace(/['"]/g, '');
    }
  }
  return filename;
};
const uid = () =>
  String(Date.now().toString(32) + Math.random().toString(16)).replace(
    /\./g,
    ''
  );
export {
  getFileNameFromHeaderDisposition,
  openNotificationWithIcon,
  capitalizeFirstLetter,
  uid,
};
