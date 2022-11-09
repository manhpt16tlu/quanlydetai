import Organ from '../pages/Organ/Organ';
import Topic from '../pages/Topic/Topic';
import { routes as routesConfig } from 'configs/general';
import Home from 'pages/Home/Home';
import OrganCreate from 'pages/Organ/OrganCreate';
import OrganList from 'pages/Organ/OrganList';
import NotFound from 'pages/NotFound/NotFound';
import OrganDetail from 'pages/Organ/OrganDetail';
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
    component: <Topic />,
  },
  {
    path: routesConfig.notfound,
    component: <NotFound />,
  },
];
const privateRoutes = [];
export { publicRoutes, privateRoutes };
