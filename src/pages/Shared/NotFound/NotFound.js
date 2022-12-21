import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';
import { routes as routesConfig, ROLES } from 'configs/general';
import * as authService from 'services/AuthService';
function NotFound() {
  let home;
  const user = authService.getCurrentUser();
  if (user.roles.includes(ROLES.admin)) home = routesConfig[ROLES.admin].home;
  else if (user.roles.includes(ROLES.employee))
    home = routesConfig[ROLES.employee].home;
  return (
    <Result
      status="404"
      title="404"
      subTitle="Xin lỗi, trang bạn truy cập không tồn tại."
      extra={
        <Button type="primary">
          <Link to={home}>Quay về trang chủ</Link>
        </Button>
      }
    />
  );
}

export default NotFound;
