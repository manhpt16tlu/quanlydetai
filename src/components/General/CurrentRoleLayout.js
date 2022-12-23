import AdminAppLayout from 'components/Layouts/v2/admin/AppLayout';
import EmployeeAppLayout from 'components/Layouts/v2/employee/AppLayout';
import { ROLES } from 'configs/general';
import * as authService from 'services/AuthService';
function CurrentRoleLayout({ children }) {
  const user = authService.getCurrentUser();
  const userRoles = user?.roles;
  if (userRoles.includes(ROLES.admin))
    return <AdminAppLayout>{children}</AdminAppLayout>;
  else if (userRoles.includes(ROLES.employee))
    return <EmployeeAppLayout>{children}</EmployeeAppLayout>;
}

export default CurrentRoleLayout;
