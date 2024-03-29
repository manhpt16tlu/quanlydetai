import {
  ApiOutlined,
  FileTextOutlined,
  FolderOutlined,
  LogoutOutlined,
  OrderedListOutlined,
  PlusOutlined,
  UserOutlined,
  AntDesignOutlined,
  BellOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Button,
  Col,
  Dropdown,
  Image,
  Layout,
  Menu,
  Row,
  Space,
  Typography,
} from 'antd';
import { ROLES, routes as routesConfig } from 'configs/general';
import { createContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as authService from 'services/AuthService';
import UserAvatar from '../parts/UserAvatar/UserAvatar';
import style from './AppLayout.module.scss';
const { Header, Sider, Content, Footer } = Layout;
const { Text, Title } = Typography;
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const sidebarItems = [
  getItem('Đề tài', 'sub1', <FolderOutlined />, [
    getItem(
      <Link to={routesConfig[ROLES.employee].topicCreate}>Đề xuất</Link>,
      routesConfig[ROLES.employee].topicCreate,
      <PlusOutlined />
    ),
    getItem(
      <Link to={routesConfig[ROLES.employee].topicList}>Danh sách đề tài</Link>,
      routesConfig[ROLES.employee].topicList,
      <OrderedListOutlined />
    ),
  ]),
  getItem(
    <Link to={routesConfig[ROLES.employee].form}>Biểu mẫu</Link>,
    routesConfig[ROLES.employee].form,
    <FileTextOutlined />
  ),
  getItem(
    <Link to={routesConfig[ROLES.employee].setup}>Thiết lập</Link>,
    routesConfig[ROLES.employee].setup,
    <ApiOutlined />
  ),
];
const userItems = [
  getItem(
    <Link to={routesConfig.myAccount}>Tài khoản của tôi</Link>,
    'myaccount',
    <UserOutlined />
  ),
  getItem('Đăng xuất', 'logout', <LogoutOutlined />),
];
const LayoutContext = createContext();
function AppLayout(props) {
  const navigate = useNavigate();
  const [refreshAvatarHeader, setRefreshAvatarHeader] = useState(false);
  const location = useLocation();
  const user = authService.getCurrentUser();
  const { pathname, state } = location;
  let menuKey = pathname; //hight light menu key
  let previousPath = state?.previousPath;
  switch (pathname) {
    case routesConfig[ROLES.employee].topicDetail:
      menuKey = previousPath ? previousPath : pathname;
      break;
    default:
      menuKey = pathname;
      break;
  }
  const handleUserMenuClick = ({ key }) => {
    if (key === 'logout') {
      authService.logout();
      navigate(routesConfig.login, { replace: true });
    }
  };
  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsible
        collapsedWidth="0" //set width của sider khi collapse,set bằng 0 thì sẽ hiện nút trigger
      >
        <div className={style.logo}>
          <Title level={4}>
            <Link
              to={routesConfig[ROLES.employee].home}
              style={{
                color: '#ffffff',
              }}
            >
              QUAN LY DE TAI
            </Link>
          </Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[menuKey]}
          items={sidebarItems}
        />
      </Sider>
      <Layout>
        <Header
          className={style.siteLayoutSubHeaderBackground}
          style={{
            paddingRight: 16,
            background: '#fff',
          }}
        >
          <Row justify="end">
            <Col>
              <Space>
                <Dropdown
                  menu={{
                    items: userItems,
                    onClick: handleUserMenuClick,
                  }}
                  placement="bottom"
                  arrow
                >
                  <Text strong>{user?.username}</Text>
                </Dropdown>
                <Badge count={3} size="small" offset={[-6, 6]}>
                  <Button
                    // type="primary"
                    shape="circle"
                    icon={<BellOutlined />}
                    size="large"
                  />
                </Badge>
                <UserAvatar
                  username={user?.username}
                  refreshAvatarHeader={refreshAvatarHeader}
                />
              </Space>
            </Col>
          </Row>
        </Header>
        <Content
          style={{
            margin: '24px 16px 0',
          }}
        >
          <LayoutContext.Provider
            value={[refreshAvatarHeader, setRefreshAvatarHeader]}
          >
            <div
              className={style.siteLayoutBackground}
              style={{
                padding: 24,
                minHeight: '100vh',
              }}
            >
              {props.children}
            </div>
          </LayoutContext.Provider>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          <Image
            preview={false}
            width={25}
            src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
          />
          <Text
            style={{
              marginLeft: 10,
            }}
          >
            Ant Design ©2022 Sở Khoa học và Công nghệ
          </Text>
        </Footer>
      </Layout>
    </Layout>
  );
}

export default AppLayout;
export { LayoutContext };
