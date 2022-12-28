import { ROLES, routes as routesConfig } from 'configs/general';
import FormFileList from 'pages/Admin/Form/FormFileList';
import Home from 'pages/Admin/Home/Home';
import Organ from 'pages/Admin/Organ/Organ';
import UISetup from 'pages/Admin/Setup/UISetup';
import TopicApprove from 'pages/Admin/Topic/TopicApprove';
import TopicDetail from 'pages/Admin/Topic/TopicDetail';
import TopicList from 'pages/Admin/Topic/TopicList';
import EmployeeForm from 'pages/Employee/Form/FormFileList';
import EmployeeHome from 'pages/Employee/Home/Home';
import EmployeeTopicCreate from 'pages/Employee/Topic/TopicCreate';
import EmployeeTopicDetail from 'pages/Employee/Topic/TopicDetail';
import EmployeeTopicList from 'pages/Employee/Topic/TopicList';
import EmployeeSetup from 'pages/Employee/Setup/Setup';
import Login from 'pages/Public/Login/Login';
import Register from 'pages/Public/Register/Register';
import NotFound from 'pages/Shared/NotFound/NotFound';
import Account from 'pages/Admin/Account/Account';
import MyAccount from 'pages/Shared/MyAccount/MyAccount';
import TopicSetup from 'pages/Admin/Setup/TopicSetup';
import TopicApproveV2 from 'pages/Admin/Topic/TopicApprove_v2';

const privateRoutes = {
  [ROLES.admin]: [
    {
      path: routesConfig[ROLES.admin].organ,
      component: <Organ />,
    },
    {
      path: routesConfig[ROLES.admin].topicApprove,
      component: <TopicApproveV2 />,
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
      path: routesConfig[ROLES.admin].uiSetup,
      component: <UISetup />,
    },
    {
      path: routesConfig[ROLES.admin].topicSetup,
      component: <TopicSetup />,
    },
    {
      path: routesConfig[ROLES.admin].home,
      component: <Home />,
    },
    {
      path: routesConfig[ROLES.admin].accounts,
      component: <Account />,
    },
  ],
  [ROLES.employee]: [
    {
      path: routesConfig[ROLES.employee].topicDetail,
      component: <EmployeeTopicDetail />,
    },
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
    {
      path: routesConfig[ROLES.employee].setup,
      component: <EmployeeSetup />,
    },
  ],
  shared: [
    {
      path: routesConfig.notFound,
      component: <NotFound />,
      // differentLayout: true,
    },
    {
      path: routesConfig.notFoundNavigate,
      component: <NotFound />,
      // differentLayout: true,
    },
    {
      path: routesConfig.myAccount,
      component: <MyAccount />,
      differentLayout: true, // chung route nhưng khác layout
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
