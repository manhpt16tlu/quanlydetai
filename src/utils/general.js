import { notification } from 'antd';
import { TABLE_PAGE_SIZE, DOC, DOCUMENT_TITLE } from 'configs/general';
import produce from 'immer';
import { Route } from 'react-router-dom';
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
const capitalizeFirstLetterEachWord = (string) => {
  return string
    .toLowerCase()
    .split(' ')
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
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
const getMessageValidateLength = (lengthType, length) => {
  if (lengthType === 'min') return `Không được nhỏ hơn ${length} kí tự`;
  else if (lengthType === 'max') return `Không được lớn hơn ${length} kí tự`;
};
const INITIAL_PAGE_STATE = {
  current: 1,
  pageSize: TABLE_PAGE_SIZE,
  totalElements: null,
  tableData: [],
};
const pageReducer = (state, action) => {
  switch (action.type) {
    case 'PAGE_CHANGE':
      return produce(state, (draft) => {
        draft.current = action.current;
        draft.pageSize = action.pageSize;
      });
    case 'FETCH':
      return produce(state, (draft) => {
        draft.totalElements = action.totalElements;
        draft.pageSize = action.pageSize;
        draft.tableData = action.tableData;
      });
    default:
      return state;
  }
};
const generateManagerName = (manager) => {
  //prettier-ignore
  return `${manager?.rank?.name ? `${manager.rank.name}. ` : ''}${capitalizeFirstLetterEachWord(manager.name)}`;
};
const generateNestedRoutes = (childRoutes) => {
  let indexRoute;
  const routes = childRoutes.map((route, index) => {
    if (route.index)
      indexRoute = <Route index key={index} element={route.component} />;
    return <Route key={index} path={route.path} element={route.component} />;
  });
  routes.push(indexRoute);
  return routes;
};
function getMenuItemObj(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const setDocumentTitle = (path) => {
  document.title = DOCUMENT_TITLE[path] ?? 'Page not found - QuanLyDeTai';
};
const generateMoneyString = (money) => {
  return `${money}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
export {
  generateMoneyString,
  setDocumentTitle,
  getMenuItemObj,
  generateNestedRoutes,
  generateManagerName,
  INITIAL_PAGE_STATE,
  pageReducer,
  getMessageValidateLength,
  capitalizeFirstLetterEachWord,
  getFileNameFromHeaderDisposition,
  openNotificationWithIcon,
  capitalizeFirstLetter,
  uid,
};
