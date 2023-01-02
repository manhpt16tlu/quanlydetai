import AdminAppLayout from 'components/Layouts/v2/admin/AppLayout';
import EmployeeAppLayout from 'components/Layouts/v2/employee/AppLayout';
import { Route, Routes, useLocation } from 'react-router-dom';
import 'antd/dist/antd.css'; //css antd
import { publicRoutes, privateRoutes } from './routes/Routes';
import ProtectedRoute from 'components/General/ProtectedRoute';
import { ROLES } from 'configs/general';
import { AntdSettingProvider } from 'context/AntdSettingContext';
import CurrentRoleLayout from 'components/General/CurrentRoleLayout';
import { generateNestedRoutes, setDocumentTitle } from 'utils/general';
import { useEffect } from 'react';
function App() {
  const location = useLocation();
  //update title page theo location
  useEffect(() => {
    setDocumentTitle(location.pathname);
  }, [location]);

  return (
    <AntdSettingProvider>
      <Routes>
        {privateRoutes[ROLES.admin].map((route, index) => {
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <ProtectedRoute roles={[ROLES.admin]}>
                  <AdminAppLayout>{route.component}</AdminAppLayout>
                </ProtectedRoute>
              }
            />
          );
        })}
        {privateRoutes[ROLES.employee].map((route, index) => {
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <ProtectedRoute roles={[ROLES.employee]}>
                  <EmployeeAppLayout>{route.component}</EmployeeAppLayout>
                </ProtectedRoute>
              }
            />
          );
        })}
        {privateRoutes.shared.map((route, index) => {
          if (route.differentLayout)
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <ProtectedRoute roles={[ROLES.employee, ROLES.admin]}>
                    <CurrentRoleLayout>{route.component}</CurrentRoleLayout>
                  </ProtectedRoute>
                }
              >
                {route.child ? generateNestedRoutes(route.child) : null}
              </Route>
            );
          else
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <ProtectedRoute roles={[ROLES.employee, ROLES.admin]}>
                    {route.component}
                  </ProtectedRoute>
                }
              >
                {route.child ? generateNestedRoutes(route.child) : null}
              </Route>
            );
        })}
        {publicRoutes.map((route, index) => {
          return (
            <Route key={index} path={route.path} element={route.component} />
          );
        })}
      </Routes>
    </AntdSettingProvider>
  );
}

export default App;
