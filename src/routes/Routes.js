import { routes as routesConfig } from 'configs/general';
import OrganCreate from 'pages/Admin/Organ/OrganCreate';
import OrganList from 'pages/Admin/Organ/OrganList';
import NotFound from 'pages/Shared/NotFound/NotFound';
import OrganDetail from 'pages/Admin/Organ/OrganDetail';
import { ROLES } from 'configs/general';
import TopicApprove from 'pages/Admin/Topic/TopicApprove';
import TopicList from 'pages/Admin/Topic/TopicList';
import FormFileList from 'pages/Admin/Form/FormFileList';
import TopicDetail from 'pages/Admin/Topic/TopicDetail';
import Login from 'pages/Public/Login/Login';
import Register from 'pages/Public/Register/Register';
import Setup from 'pages/Admin/Setup/Setup';
import Home from 'pages/Admin/Home/Home';
import EmployeeHome from 'pages/Employee/Home/Home';
import EmployeeTopicCreate from 'pages/Employee/Topic/TopicCreate';
import EmployeeTopicList from 'pages/Employee/Topic/TopicList';
import EmployeeForm from 'pages/Employee/Form/FormFileList';
const privateRoutes = {
  [ROLES.admin]: [
    {
      path: routesConfig[ROLES.admin].organCreate,
      component: <OrganCreate />,
    },
    {
      path: routesConfig[ROLES.admin].organList,
      component: <OrganList />,
    },
    {
      path: routesConfig[ROLES.admin].organDetail,
      component: <OrganDetail />,
    },
    {
      path: routesConfig[ROLES.admin].topicApprove,
      component: <TopicApprove />,
    },
    {
      path: routesConfig[ROLES.admin].topicList,
      component: <TopicList />,
    },
    {
      path: routesConfig[ROLES.admin].topicDetail,
      component: <TopicDetail />,
    },
    {
      path: routesConfig[ROLES.admin].form,
      component: <FormFileList />,
    },
    {
      path: routesConfig[ROLES.admin].setup,
      component: <Setup />,
    },
    {
      path: routesConfig[ROLES.admin].home,
      component: <Home />,
    },
  ],
  [ROLES.employee]: [
    {
      path: routesConfig[ROLES.employee].home,
      component: <EmployeeHome />,
    },
    {
      path: routesConfig[ROLES.employee].topicCreate,
      component: <EmployeeTopicCreate />,
    },
    {
      path: routesConfig[ROLES.employee].topicList,
      component: <EmployeeTopicList />,
    },
    {
      path: routesConfig[ROLES.employee].form,
      component: <EmployeeForm />,
    },
  ],
  shared: [
    {
      path: routesConfig.notFound,
      component: <NotFound />,
    },
    {
      path: routesConfig.notFoundNavigate,
      component: <NotFound />,
    },
  ],
};
const publicRoutes = [
  {
    path: routesConfig.login,
    component: <Login />,
  },
  {
    path: routesConfig.register,
    component: <Register />,
  },
];
export { publicRoutes, privateRoutes };
