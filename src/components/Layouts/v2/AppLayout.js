import {
  AreaChartOutlined,
  BankOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  FolderOutlined,
  PlusOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Typography } from 'antd';
import { routes as routesConfig } from 'configs/general';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import style from './AppLayout.module.scss';
const { Header, Sider, Content, Footer } = Layout;
const { Title } = Typography;
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const items = [
  getItem('Đề tài', 'sub1', <FolderOutlined />, [
    getItem(
      <Link to={routesConfig.topicCreate}>Tạo mới</Link>,
      routesConfig.topicCreate,
      <PlusOutlined />
    ),
    getItem(
      <Link to={routesConfig.topicList}>Xem và chỉnh sửa</Link>,
      routesConfig.topicList,
      <SettingOutlined />
    ),
    getItem(
      <Link to={routesConfig.topicApprove}>Phê duyệt</Link>,
      routesConfig.topicApprove,
      <CheckCircleOutlined />
    ),
  ]),
  getItem('Cơ quan', 'sub2', <BankOutlined />, [
    getItem(
      <Link to={routesConfig.organCreate}>Tạo mới</Link>,
      routesConfig.organCreate,
      <PlusOutlined />
    ),
    getItem(
      <Link to={routesConfig.organList}>Xem và chỉnh sửa</Link>,
      routesConfig.organList,
      <SettingOutlined />
    ),
  ]),
  getItem('Thống kê', '6', <AreaChartOutlined />),
  getItem('Biểu mẫu', '7', <FileTextOutlined />),
];
function AppLayout(props) {
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
  // if (pathname.includes('/detail')) {
  //   if (pathname.startsWith('/topic')) {
  //     if (previousPath === routesConfig.topicApprove)
  //       menuKey = routesConfig.topicApprove;
  //     else menuKey = routesConfig.topicList;
  //   } else if (pathname.startsWith('/organization')) {
  //     menuKey = routesConfig.organList;
  //   }
  // }
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
              to={routesConfig.home}
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
          items={items}
        />
      </Sider>
      <Layout>
        <Header
          className={style.siteLayoutSubHeaderBackground}
          style={{
            padding: 0,
            background: '#fff',
          }}
        />
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
          Ant Design ©2022 Sở Khoa học và công nghệ Phú Thọ
        </Footer>
      </Layout>
    </Layout>
  );
}

export default AppLayout;
