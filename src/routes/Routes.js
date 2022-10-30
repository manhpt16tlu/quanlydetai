import Organ from '../pages/Organ/Organ';
import Topic from '../pages/Topic/Topic';
const publicRoutes = [
  {
    path: '/organ',
    component: <Organ />,
  },
  {
    path: '/topic',
    component: <Topic />,
  },
];
const privateRoutes = [];
export { publicRoutes, privateRoutes };
