import { faAddressCard, faKey } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Breadcrumb, Col, Menu, Row } from 'antd';
import CustomDivider from 'components/General/CustomDivider';
import { routes as routesConfig } from 'configs/general';
import { Link, Outlet } from 'react-router-dom';
import { getMenuItemObj } from 'utils/general';

function MyAccount() {
  // prettier-ignore
  const items = [
    getMenuItemObj( <Link to={routesConfig.myAccountProfileEdit}>Chỉnh sửa thông tin</Link>,routesConfig.myAccountProfileEdit, <FontAwesomeIcon icon={faAddressCard} />),
    getMenuItemObj( <Link to={routesConfig.myAccountPasswordChange}>Đổi mật khẩu</Link>,routesConfig.myAccountPasswordChange , <FontAwesomeIcon icon={faKey} />),
  ];
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link>Trang chủ</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Tài khoản của tôi</Breadcrumb.Item>
      </Breadcrumb>
      <CustomDivider text="Thông tin tài khoản" />
      <Row>
        <Col span={5}>
          <Menu
            style={{
              width: '100%',
            }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
            items={items}
          />
        </Col>
        <Col span={19}>
          <Outlet />
        </Col>
      </Row>
    </>
  );
}

export default MyAccount;
