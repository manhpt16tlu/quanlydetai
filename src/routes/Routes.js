import Organ from '../pages/Organ/Organ';
import Topic from '../pages/Topic/Topic';
import routesConfig from './config';
import Home from 'pages/Home/Home';
import OrganCreate from 'pages/Organ/OrganCreate';
import OrganList from 'pages/Organ/OrganList';
import NotFound from 'pages/NotFound/NotFound';
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
