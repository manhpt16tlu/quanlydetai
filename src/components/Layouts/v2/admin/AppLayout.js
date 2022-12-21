import {
  ApiOutlined,
  BankOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  FolderOutlined,
  LogoutOutlined,
  PlusOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
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
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as authService from 'services/AuthService';
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
      <Link to={routesConfig[ROLES.admin].topicCreate}>Tạo mới</Link>,
      routesConfig[ROLES.admin].topicCreate,
      <PlusOutlined />
    ),
    getItem(
      <Link to={routesConfig[ROLES.admin].topicList}>Xem và chỉnh sửa</Link>,
      routesConfig[ROLES.admin].topicList,
      <SettingOutlined />
    ),
    getItem(
      <Link to={routesConfig[ROLES.admin].topicApprove}>Phê duyệt</Link>,
      routesConfig[ROLES.admin].topicApprove,
      <CheckCircleOutlined />
    ),
  ]),
  getItem('Cơ quan', 'sub2', <BankOutlined />, [
    getItem(
      <Link to={routesConfig[ROLES.admin].organCreate}>Tạo mới</Link>,
      routesConfig[ROLES.admin].organCreate,
      <PlusOutlined />
    ),
    getItem(
      <Link to={routesConfig[ROLES.admin].organList}>Xem và chỉnh sửa</Link>,
      routesConfig[ROLES.admin].organList,
      <SettingOutlined />
    ),
  ]),
  getItem(
    <Link to={routesConfig[ROLES.admin].form}>Biểu mẫu</Link>,
    routesConfig[ROLES.admin].form,
    <FileTextOutlined />
  ),
  getItem(
    <Link to={routesConfig[ROLES.admin].setup}>Thiết lập</Link>,
    routesConfig[ROLES.admin].setup,
    <ApiOutlined />
  ),
];
const userItems = [getItem('Đăng xuất', 'logout', <LogoutOutlined />)];

function AppLayout(props) {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const location = useLocation();
  const { pathname, state } = location;
  let menuKey = pathname; //hight light menu key
  let previousPath = state?.previousPath;

  switch (pathname) {
    case routesConfig.topicDetail:
      menuKey = previousPath ? previousPath : pathname;
      break;
    case routesConfig.organDetail:
      menuKey = routesConfig.organList;
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
              to={routesConfig[ROLES.admin].home}
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
                <Text strong>{user?.username}</Text>
                <Dropdown
                  menu={{
                    items: userItems,
                    onClick: handleUserMenuClick,
                  }}
                  placement="bottomRight"
                  arrow
                >
                  <Avatar size="default" icon={<UserOutlined />} />
                </Dropdown>
              </Space>
            </Col>
          </Row>
        </Header>
        <Content
          style={{
            margin: '24px 16px 0',
          }}
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
            Ant Design ©2022 Sở Khoa học và công nghệ
          </Text>
        </Footer>
      </Layout>
    </Layout>
  );
}

export default AppLayout;
