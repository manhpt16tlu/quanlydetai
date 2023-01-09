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
    // topicCreate: '/admin/topic/create',
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
  myAccountProfileEdit: 'profile', //nested route
  myAccountPasswordChange: 'password/change', //nested route
  notFoundNavigate: '/notfound',
  notFound: '*',
  register: '/register',
  login: '/login',
};
const MESSAGE_REQUIRE = 'Không được để trống';
const DATE_FORMAT = 'YYYY-MM-DD';

const antdIconFontSize = 14;
const MIME_TYPE = {
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  pdf: 'application/pdf',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};
const AVATAR_MIME_TYPE = {
  png: 'image/png',
  jpeg: 'image/jpeg',
};
const MAX_FILE_SIZE = 10000000; //10mb
const MAX_AVATAR_SIZE = 300000;
const TIMESTAMP_FORMAT = 'MMMM DD YYYY, h:mm:ss a';
const TOPIC_FILE_TYPE = {
  outline: 'Đề cương',
  report: 'Báo cáo',
};
const FILE_TYPE = {
  topic: 'topic',
  form: 'form',
  avatar: 'avatar',
};
const DOCUMENT_TITLE = {
  [routes.login]: 'Đăng nhập',
  [routes.register]: 'Đăng ký tài khoản',
  [routes[ROLES.employee].topicCreate]: 'Đề xuất đề tài',
  [routes[ROLES.employee].topicDetail]: 'Chi tiết đề tài',
  [routes[ROLES.employee].setup]: 'Thiết lập ứng dụng',
  [routes[ROLES.employee].topicList]: 'Danh sách đề tài',
  [routes[ROLES.employee].accounts]: 'Quản lý tài khoản',
  [routes[ROLES.employee].form]: 'Danh sách biểu mẫu',
  [routes[ROLES.employee].home]: 'Trang chủ',
  [routes[ROLES.admin].topicList]: 'Danh sách đề tài',
  [routes[ROLES.admin].home]: 'Trang chủ',
  [routes[ROLES.admin].topicApprove]: 'Phê duyệt đề tài',
  [routes[ROLES.admin].topicDetail]: 'Chi tiết đề tài',
  [routes[ROLES.admin].organ]: 'Quản lý cơ quan',
  [routes[ROLES.admin].form]: 'Quản lý biểu mẫu',
  [routes[ROLES.admin].accounts]: 'Quản lý tài khoản',
  [routes[ROLES.admin].uiSetup]: 'Thiết lập giao diện',
  [routes[ROLES.admin].topicSetup]: 'Thiết lập đề tài',
  [routes.myAccount]: 'Tài khoản của tôi',
  [routes.notFoundNavigate]: 'Page not found - QuanLyDeTai',
  [routes.myAccount + '/' + routes.myAccountPasswordChange]: 'Đổi mật khẩu',
  [routes.myAccount + '/' + routes.myAccountProfileEdit]: 'Thông tin tài khoản',
};
const TABLE_PAGE_SIZE = 10;
// khớp với backend
const TOPIC_STATUS_DEFAULT = {
  CHUA_DUYET: 'Chưa duyệt',
  DA_PHE_DUYET: 'Đã phê duyệt',
  DANG_THUC_HIEN: 'Đang thực hiện',
  DA_NGHIEM_THU: 'Đã nghiệm thu',
};
const TOPIC_RESULT_DEFAULT = {
  DAT: 'Đạt',
  KHONG_DAT: 'Không đạt',
  TOT: 'Tốt',
  XUAT_SAC: 'Xuất sắc',
  KHONG_XAC_DINH: 'Không xác định',
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
const REQUEST_METHOD_NAME = {
  get: 'GET',
  post: 'POST',
  put: 'PUT',
  patch: 'PATCH',
  delete: 'DELETE',
};
export {
  MAX_AVATAR_SIZE,
  AVATAR_MIME_TYPE,
  REQUEST_METHOD_NAME,
  DOCUMENT_TITLE,
  TABLE_PAGE_SIZE,
  TOPIC_RESULT_DEFAULT,
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
  MIME_TYPE,
  MAX_FILE_SIZE,
  ROLES,
};
