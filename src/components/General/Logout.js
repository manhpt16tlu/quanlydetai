import { Navigate } from 'react-router-dom';
import { routes as routesConfig } from 'configs/general';
function Logout() {
  localStorage.clear();
  return <Navigate to={routesConfig.login} replace={true} />;
}

export default Logout;
