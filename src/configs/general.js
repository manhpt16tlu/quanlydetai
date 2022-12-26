const ROLES = {
  admin: 'ADMIN',
  employee: 'EMPLOYEE',
};
const routes = {
  [ROLES.employee]: {
    topicCreate: '/topic/create',
    topicList: '/topic/list',
    topicDetail: '/topic/detail',
    setup: '/setup',
    form: '/form',
    home: '/',
  },
  [ROLES.admin]: {
    topicCreate: '/admin/topic/create',
    topicList: '/admin/topic/list',
    topicApprove: '/admin/topic/approve',
    topicDetail: '/admin/topic/detail',
    organ: '/admin/organization',
    form: '/admin/form',
    uiSetup: '/admin/setup/ui',
    topicSetup: '/admin/setup/topic',
    home: '/admin',
    accounts: '/admin/accounts',
  },
  myAccount: '/myAccount',
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
const antdIconFontSize = 14;
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
const FILE_TYPE = {
  topic: 'topic',
  form: 'form',
};

// khớp với backend
const TOPIC_STATUS_DEFAULT = {
  CHUA_DUYET: 'Chưa duyệt',
  DA_PHE_DUYET: 'Đã phê duyệt',
  DANG_THUC_HIEN: 'Đang thực hiện',
  DA_NGHIEM_THU: 'Đã nghiệm thu',
};
const LOCALSTORAGE_KEY = {
  currentUser: 'user',
  componentSize: 'componentSize',
  tableStyle: 'tableStyle',
};
const MESSAGE_RESPONSE = {
  USER_DISABLED: 'User is disabled', // lấy từ backend response để check
  USER_UNAUTHORIZED: 'Can not authenticate user',
};
export {
  TOPIC_STATUS_DEFAULT,
  MESSAGE_RESPONSE,
  FILE_TYPE,
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
