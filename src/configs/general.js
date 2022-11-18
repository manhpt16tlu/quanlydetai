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
  notFound: '*',
  notFoundRedirect: '/pagenotfound',
};
const menuBarLeftType = {
  organ: 'organization',
  topic: 'topic',
};
const MESSAGE_REQUIRE = 'Không được để trống';
const DATE_FORMAT = 'YYYY-MM-DD';
const DEFAULT_TOPIC_VALUES = {
  status: 1,
  result: 5,
};
export {
  routes,
  menuBarLeftType,
  MESSAGE_REQUIRE,
  DATE_FORMAT,
  DEFAULT_TOPIC_VALUES,
};
