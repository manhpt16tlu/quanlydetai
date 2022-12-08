const routes = {
  home: '/',
  topicCreate: '/topic/create',
  topicList: '/topic/list',
  topicApprove: '/topic/approve',
  topicDetail: '/topic/detail',
  organCreate: '/organization/create',
  organList: '/organization/list',
  organDetail: '/organization/detail',
  form: '/form',
  statistic: '/statistic',
  setup: '/setup',
  notFound: '*',
  notFoundRedirect: '/pagenotfound',
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
export {
  TIMESTAMP_FORMAT,
  antdIconFontSize,
  routes,
  MESSAGE_REQUIRE,
  DATE_FORMAT,
  DEFAULT_TOPIC_VALUES,
  MIME_TYPE,
  MAX_FILE_SIZE,
};
