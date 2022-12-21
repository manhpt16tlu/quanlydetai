import Logout from 'components/General/Logout';
import { routes as routesConfig } from 'configs/general';
import { Navigate } from 'react-router-dom';
import * as authService from 'services/AuthService';

function ProtectedRoute({ roles, children }) {
  const user = authService.getCurrentUser();
  if (authService.checkExpiredToken()) return <Logout />;
  if (!user.roles.some((role) => roles.includes(role)))
    return <Navigate to={routesConfig.notFoundNavigate} replace={true} />;

  return children;
}

export default ProtectedRoute;
