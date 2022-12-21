const ROLES = {
  admin: 'ADMIN',
  employee: 'EMPLOYEE',
};
const routes = {
  [ROLES.employee]: {
    topicCreate: '/topic/create',
    topicList: '/topic/list',
    topicDetail: '/topic/detail',
    form: '/form',
    home: '/',
  },
  [ROLES.admin]: {
    topicCreate: '/admin/topic/create',
    topicList: '/admin/topic/list',
    topicApprove: '/admin/topic/approve',
    topicDetail: '/admin/topic/detail',
    organCreate: '/admin/organization/create',
    organList: '/admin/organization/list',
    organDetail: '/admin/organization/detail',
    form: '/admin/form',
    setup: '/admin/setup',
    home: '/admin',
  },
  notFoundNavigate: '/notfound',
  notFound: '*',
  register: '/register',
  login: '/login',
};
const MESSAGE_REQUIRE = 'Không được để trống';
const DATE_FORMAT = 'YYYY-MM-DD';
const DEFAULT_TOPIC_VALUES = {
  status: 1,
  result: 5,
};
const antdIconFontSize = 16;
const MIME_TYPE = {
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  pdf: 'application/pdf',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};
const MAX_FILE_SIZE = 10000000; //10mb
const TIMESTAMP_FORMAT = 'MMMM DD YYYY, h:mm:ss a';
const TOPIC_FILE_TYPE = {
  outline: 'Đề cương',
  report: 'Báo cáo',
};
const LOCALSTORAGE_KEY = {
  currentUser: 'user',
};
export {
  LOCALSTORAGE_KEY,
  TOPIC_FILE_TYPE,
  TIMESTAMP_FORMAT,
  antdIconFontSize,
  routes,
  MESSAGE_REQUIRE,
  DATE_FORMAT,
  DEFAULT_TOPIC_VALUES,
  MIME_TYPE,
  MAX_FILE_SIZE,
  ROLES,
};
