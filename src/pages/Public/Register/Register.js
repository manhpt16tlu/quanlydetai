import {
  Button,
  Form,
  Input,
  Alert,
  Row,
  Col,
  Select,
  message,
  Typography,
} from 'antd';
import CustomDivider from 'components/General/CustomDivider';
import {
  MESSAGE_REQUIRE,
  ROLES,
  routes as routesConfig,
} from 'configs/general';
import produce from 'immer';
import { useEffect, useReducer } from 'react';
import * as organService from 'services/OrganService';
import * as authService from 'services/AuthService';
import * as userService from 'services/UserService';
import { optionSelectFillOBJ } from 'utils/topicUtil';
import {
  getMessageValidateLength,
  openNotificationWithIcon,
} from 'utils/general';
import { Link as RouteLink } from 'react-router-dom';
import BackgroundLogo from 'components/General/BackgroundLogo';
const { Text } = Typography;
const formFieldName = {
  fullname: 'hoten',
  organ: 'coquanchutri',
  username: 'tendangnhap',
  password: 'matkhau',
};
const initFormData = {
  data: {
    [formFieldName.organ]: [],
  },
};
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH':
      return produce(state, (draft) => {
        //dùng immer nên có thể mutate state
        draft.data[formFieldName.organ] = action.payload.organ;
      });
    // case 'EXIST_USERNAME_ERR':
    //   return produce(state, (draft) => {
    //     //dùng immer nên có thể mutate state
    //     draft.err.usernameExist = true;
    //   });
    // case 'REMOVE_ALL_ERR':
    //   return produce(state, (draft) => {
    //     //dùng immer nên có thể mutate state
    //     draft.err = {};
    //   });

    default:
      return state;
  }
};

function Register() {
  const [form] = Form.useForm();
  const [formData, dispatch] = useReducer(reducer, initFormData);
  const handleFormValuesChange = (changedValues, allValues) => {
    // dispatch({ type: 'REMOVE_ALL_ERR' });
  };
  const onFinish = async (values) => {
    console.log('submit:', values);
    const username = values[formFieldName.username];
    const password = values[formFieldName.password];
    const name = values[formFieldName.fullname];
    const roles = [ROLES.employee];
    const organ = JSON.parse(values[formFieldName.organ]);
    try {
      const existByUserName = (
        await userService.existByUserName(values[formFieldName.username])
      )?.data;

      if (!existByUserName) {
        authService
          .register({
            username,
            password,
            name,
            roles,
            organ,
          })
          .then(() => {
            openNotificationWithIcon('success', 'Tạo tài khoản', 'topRight');
            form.resetFields();
          });
      } else {
        openNotificationWithIcon(
          'error',
          null,
          'topRight',
          'Tên tài khoản đã tồn tại'
        );
      }
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  useEffect(() => {
    console.log('call api');
    const callApi = async () => {
      try {
        const organData = (await organService.getAllNoPaging())?.data;
        dispatch({
          type: 'FETCH',
          payload: {
            organ: optionSelectFillOBJ(organData),
          },
        });
      } catch (error) {
        message.error('Có lỗi xảy ra');
      }
    };
    callApi();
  }, []);
  return (
    <>
      <Row>
        <Col span={14}>
          <BackgroundLogo />
        </Col>
        <Col span={10}>
          <Form
            onValuesChange={handleFormValuesChange}
            form={form}
            name="basic"
            layout="vertical"
            // labelCol={{
            //   offset: 8,
            // }}
            // wrapperCol={{
            //   offset: 8,
            //   span: 8,
            // }}
            initialValues={{}}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            style={{
              margin: '0 auto',
              marginTop: 25,
              maxWidth: 400,
            }}
          >
            <Form.Item
              // wrapperCol={{
              //   offset: 8,
              //   span: 8,
              // }}
              style={{
                marginBottom: 0,
              }}
            >
              <CustomDivider text="Tạo tài khoản" />
            </Form.Item>
            <Form.Item
              label="Họ tên"
              name={formFieldName.fullname}
              rules={[
                {
                  required: true,
                  message: MESSAGE_REQUIRE,
                },
                {
                  min: 5,
                  message: getMessageValidateLength('min', 5),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Cơ quan chủ trì"
              name={formFieldName.organ}
              rules={[
                {
                  required: true,
                  message: MESSAGE_REQUIRE,
                },
              ]}
            >
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={formData.data[formFieldName.organ]}
              />
            </Form.Item>
            <Form.Item
              label="Tên đăng nhập"
              name={formFieldName.username}
              rules={[
                {
                  required: true,
                  message: MESSAGE_REQUIRE,
                },
                ({}) => ({
                  validator(_, value) {
                    if (!value?.includes(' ')) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('Không được chứa khoảng trắng')
                    );
                  },
                }),
                {
                  min: 10,
                  message: getMessageValidateLength('min', 10),
                },
                {
                  max: 50,
                  message: getMessageValidateLength('max', 50),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              hasFeedback
              label="Mật khẩu"
              name={formFieldName.password}
              rules={[
                {
                  required: true,
                  message: MESSAGE_REQUIRE,
                },
                {
                  min: 8,
                  message: getMessageValidateLength('min', 8),
                },
                {
                  max: 30,
                  message: getMessageValidateLength('max', 30),
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              hasFeedback
              label="Xác nhận mật khẩu"
              dependencies={[formFieldName.password]}
              rules={[
                {
                  required: true,
                  message: MESSAGE_REQUIRE,
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (
                      !value ||
                      getFieldValue(formFieldName.password) === value
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('Mật khẩu nhập lại không khớp')
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
            // wrapperCol={{
            //   offset: 8,
            //   span: 8,
            // }}
            // style={{
            //   marginBottom: 0,
            // }}
            >
              <Button type="primary" block htmlType="submit">
                Đăng kí
              </Button>
            </Form.Item>
            {/* <Form.Item shouldUpdate noStyle>
              {() => {
                return true ? (
                  <Form.Item
                    wrapperCol={{
                      offset: 8,
                      span: 8,
                    }}
                  >
                    <Alert
                      message={'Tên tài khoản đã tồn tại'}
                      type="error"
                      showIcon
                    />
                  </Form.Item>
                ) : null;
              }}
            </Form.Item> */}
            <Form.Item
            // wrapperCol={{
            //   offset: 8,
            //   span: 8,
            // }}
            >
              <Text>
                Đã có tài khoản?{' '}
                <Text underline>
                  <RouteLink to={routesConfig.login}>Đăng nhập</RouteLink>
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

export default Register;
