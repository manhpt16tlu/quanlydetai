import { routes as routesConfig } from 'configs/general';
import Topic from '../pages/Topic/Topic';
import Home from 'pages/Home/Home';
import Organ from '../pages/Organ/Organ';
import OrganCreate from 'pages/Organ/OrganCreate';
import OrganList from 'pages/Organ/OrganList';
import NotFound from 'pages/NotFound/NotFound';
import OrganDetail from 'pages/Organ/OrganDetail';
import Form from 'pages/Form/Form';
import TopicCreate from 'pages/Topic/TopicCreate';
import TopicApprove from 'pages/Topic/TopicApprove';
import TopicList from 'pages/Topic/TopicList';
const publicRoutes = [
  {
    path: routesConfig.home,
    component: <Home />,
  },
  {
    path: routesConfig.organ,
    child: [
      {
        path: routesConfig.organCreate,
        component: <OrganCreate />,
      },
      {
        index: true,
        path: routesConfig.organList,
        component: <OrganList />,
      },
      {
        path: routesConfig.organDetail,
        component: <OrganDetail />,
      },
    ],
    component: <Organ />,
  },
  {
    path: routesConfig.topic,
    child: [
      {
        path: routesConfig.topicCreate,
        component: <TopicCreate />,
      },
      {
        path: routesConfig.topicApprove,
        component: <TopicApprove />,
      },
      { index: true, path: routesConfig.topicList, component: <TopicList /> },
    ],
    component: <Topic />,
  },
  {
    path: routesConfig.notfound,
    component: <NotFound />,
  },
  {
    path: routesConfig.form,
    component: <Form />,
  },
];
const privateRoutes = [];
export { publicRoutes, privateRoutes };
