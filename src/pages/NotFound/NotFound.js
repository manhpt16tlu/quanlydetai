import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';
import { routes as routesConfig } from 'configs/general';
function NotFound() {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Xin lỗi, trang bạn truy cập không tồn tại."
      extra={
        <Button type="primary">
          <Link to={routesConfig.home}>Quay về trang chủ</Link>
        </Button>
      }
    />
  );
}

export default NotFound;
