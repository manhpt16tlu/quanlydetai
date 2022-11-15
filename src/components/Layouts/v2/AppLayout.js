import React, { useState } from 'react';
import {
  FileTextOutlined,
  SettingOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  FolderOutlined,
  BankOutlined,
  AreaChartOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Typography } from 'antd';
import style from './AppLayout.module.scss';
import { Link } from 'react-router-dom';
import { routes as routesConfig } from 'configs/general';
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
      '1',
      <PlusOutlined />
    ),
    getItem(
      <Link to={routesConfig.topicList}>Xem và chỉnh sửa</Link>,
      '2',
      <SettingOutlined />
    ),
    getItem(
      <Link to={routesConfig.topicApprove}>Phê duyệt</Link>,
      '3',
      <CheckCircleOutlined />
    ),
  ]),
  getItem('Cơ quan', 'sub2', <BankOutlined />, [
    getItem(
      <Link to={routesConfig.organCreate}>Tạo mới</Link>,
      '4',
      <PlusOutlined />
    ),
    getItem(
      <Link to={routesConfig.organList}>Xem và chỉnh sửa</Link>,
      '5',
      <SettingOutlined />
    ),
  ]),
  getItem('Thống kê', '6', <AreaChartOutlined />),
  getItem('Biểu mẫu', '7', <FileTextOutlined />),
];
function AppLayout(props) {
  return (
    <Layout>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className={style.logo}>
          <Title level={4}>
            <Link
              to={routesConfig.home}
              style={{
                color: '#ffffff',
              }}
            >
              QUẢN LÝ ĐỀ TÀI
            </Link>
          </Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          // defaultSelectedKeys={['4']}
          items={items}
        />
      </Sider>
      <Layout>
        <Header
          className={style.siteLayoutSubHeaderBackground}
          style={{
            padding: 0,
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
