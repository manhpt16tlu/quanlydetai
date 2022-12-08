import { routes as routesConfig } from 'configs/general';
import Home from 'pages/Home/Home';
import OrganCreate from 'pages/Organ/OrganCreate';
import OrganList from 'pages/Organ/OrganList';
import NotFound from 'pages/NotFound/NotFound';
import OrganDetail from 'pages/Organ/OrganDetail';
import FormFileList from 'pages/Form/FormFileList';
import TopicCreate from 'pages/Topic/TopicCreate';
import TopicApprove from 'pages/Topic/TopicApprove';
import TopicList from 'pages/Topic/TopicList';
import TopicDetail from 'pages/Topic/TopicDetail';
import Statistic from 'pages/Statistic/Statistic';
import Setup from 'pages/Setup/Setup';
const publicRoutes = [
  {
    path: routesConfig.home,
    component: <Home />,
  },

  {
    path: routesConfig.organCreate,
    component: <OrganCreate />,
  },
  {
    path: routesConfig.organList,
    component: <OrganList />,
  },
  {
    path: routesConfig.organDetail,
    component: <OrganDetail />,
  },
  {
    path: routesConfig.topicCreate,
    component: <TopicCreate />,
  },
  {
    path: routesConfig.topicApprove,
    component: <TopicApprove />,
  },
  {
    path: routesConfig.topicList,
    component: <TopicList />,
  },
  {
    path: routesConfig.topicDetail,
    component: <TopicDetail />,
  },
  {
    path: routesConfig.notFound,
    component: <NotFound />,
  },
  {
    path: routesConfig.form,
    component: <FormFileList />,
  },
  {
    path: routesConfig.statistic,
    component: <Statistic />,
  },
  {
    path: routesConfig.setup,
    component: <Setup />,
  },
  {
    path: routesConfig.notFoundRedirect,
    component: <NotFound />,
  },
];
const privateRoutes = [];
export { publicRoutes, privateRoutes };
