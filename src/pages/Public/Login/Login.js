import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  Alert,
  Button,
  Checkbox,
  Form,
  Row,
  Col,
  Input,
  Typography,
} from 'antd';
import {
  LOCALSTORAGE_KEY,
  MESSAGE_REQUIRE,
  MESSAGE_RESPONSE,
  ROLES,
  routes as routesConfig,
} from 'configs/general';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from 'services/AuthService';
import CustomDivider from 'components/General/CustomDivider';
import { Link as RouteLink } from 'react-router-dom';
import BackgroundLogo from 'components/General/BackgroundLogo';
const { Text } = Typography;
function Login() {
  const [form] = Form.useForm();
  const [loginStatus, setLoginStatus] = useState({
    fail: false,
    message: null,
  });

  const navigate = useNavigate();
  const formFieldNames = {
    username: 'tentaikhoan',
    pass: 'matkhau',
  };
  const onFinish = (values) => {
    if (localStorage.getItem(LOCALSTORAGE_KEY.currentUser))
      localStorage.removeItem(LOCALSTORAGE_KEY.currentUser);
    authService
      .login(values[formFieldNames.username], values[formFieldNames.pass])
      .then((data) => {
        const user = data.data;
        localStorage.setItem(
          LOCALSTORAGE_KEY.currentUser,
          JSON.stringify(user)
        );
        if (user.roles.includes(ROLES.admin))
          navigate(routesConfig[ROLES.admin].home, { replace: true });
        else if (user.roles.includes(ROLES.employee))
          navigate(routesConfig[ROLES.employee].home, { replace: true });
      })
      .catch((err) => {
        console.log(err);
        if (err?.response?.data?.message === MESSAGE_RESPONSE.USER_DISABLED) {
          setLoginStatus({
            fail: true,
            message: 'Tài khoản đã bị vô hiệu hóa',
          });
        } else
          setLoginStatus({
            fail: true,
            message: 'Tài khoản hoặc mật khẩu không chính xác',
          });
        form.resetFields();
      });
  };
  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  };
  const handleFormValuesChange = (changedValues, allValues) => {
    setLoginStatus({
      fail: false,
      message: null,
    });
  };
  return (
    <>
      <Row>
        <Col span={14}>
          <BackgroundLogo />
        </Col>
        <Col span={10}>
          <Form
            form={form}
            name="basic"
            onValuesChange={handleFormValuesChange}
            initialValues={{}}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            style={{
              margin: '0 auto',
              marginTop: 25,
              maxWidth: 400,
            }}
          >
            <Form.Item>
              <CustomDivider text="Đăng nhập" />
            </Form.Item>
            <Form.Item
              name={formFieldNames.username}
              rules={[
                {
                  required: true,
                  message: MESSAGE_REQUIRE,
                },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Tên tài khoản" />
            </Form.Item>
            <Form.Item
              name={formFieldNames.pass}
              rules={[
                {
                  required: true,
                  message: MESSAGE_REQUIRE,
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Mật khẩu"
              />
            </Form.Item>
            <Form.Item>
              <Form.Item valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a style={{ float: 'right' }} href="">
                Quên mật khẩu
              </a>
            </Form.Item>
            <Form.Item>
              <Button block type="primary" htmlType="submit">
                Đăng nhập
              </Button>
            </Form.Item>
            <Form.Item shouldUpdate noStyle>
              {() => {
                return loginStatus.fail ? (
                  <Form.Item>
                    <Alert
                      message={loginStatus.message}
                      type="error"
                      showIcon
                    />
                  </Form.Item>
                ) : null;
              }}
            </Form.Item>
            <Form.Item>
              <Text>
                Chưa có tài khoản?{' '}
                <Text underline>
                  <RouteLink to={routesConfig.register}>Đăng ký</RouteLink>
                </Text>{' '}
                ngay
              </Text>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
}

export default Login;
