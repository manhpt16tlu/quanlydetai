import AdminAppLayout from 'components/Layouts/v2/admin/AppLayout';
import EmployeeAppLayout from 'components/Layouts/v2/employee/AppLayout';
import { Route, Routes } from 'react-router-dom';
import 'antd/dist/antd.css'; //css antd
import { publicRoutes, privateRoutes } from './routes/Routes';
import ProtectedRoute from 'components/General/ProtectedRoute';
import { ROLES } from 'configs/general';

function App() {
  return (
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
        return (
          <Route
            key={index}
            path={route.path}
            element={
              <ProtectedRoute roles={[ROLES.employee, ROLES.admin]}>
                {route.component}
              </ProtectedRoute>
            }
          />
        );
      })}
      {publicRoutes.map((route, index) => {
        return (
          <Route key={index} path={route.path} element={route.component} />
        );
      })}
    </Routes>
  );
}

export default App;
