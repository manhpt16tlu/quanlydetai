import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space } from 'antd';
import { MESSAGE_REQUIRE } from 'configs/general';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as userService from 'services/UserService';
import {
  getMessageValidateLength,
  openNotificationWithIcon,
} from 'utils/general';
const formFieldName = {
  oldPass: 'matkhaucu',
  newPass: 'matkhaumoi',
};
function Password() {
  const [form] = Form.useForm();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [disableResetBtn, setDisableResetBtn] = useState(true);
  const onFinish = (values) => {
    setLoadingBtn(true);
    userService
      .changePassword(generateRequestParam(values))
      .then(() => {
        setTimeout(() => {
          handleResetForm();
          setLoadingBtn(false);
          openNotificationWithIcon('success', 'Đổi mật khẩu', 'top');
        }, 1200);
      })
      .catch((err) => {
        console.log(err);
        setTimeout(() => {
          openNotificationWithIcon('error', 'Đổi mật khẩu', 'top');
          setLoadingBtn(false);
        }, 1200);
      });
  };
  const generateRequestParam = (data) => {
    return {
      oldPass: data[formFieldName.oldPass],
      newPass: data[formFieldName.newPass],
    };
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const handleFormValuesChange = (changedValues, allValues) => {
    setDisableResetBtn(false);
  };
  const handleResetForm = () => {
    form.resetFields();
    setDisableResetBtn(true);
  };

  return (
    <>
      <Form
        onValuesChange={handleFormValuesChange}
        form={form}
        labelAlign="left"
        labelCol={{
          span: 4,
          offset: 1,
        }}
        wrapperCol={{
          offset: 1,
          span: 8,
        }}
        initialValues={{}}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        style={{
          marginTop: 30,
        }}
      >
        <Form.Item
          label="Mật khẩu hiện tại"
          name={formFieldName.oldPass}
          rules={[
            {
              required: true,
              message: MESSAGE_REQUIRE,
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Mật khẩu mới"
          name={formFieldName.newPass}
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
          label="Xác nhận mật khẩu mới"
          dependencies={[formFieldName.newPass]}
          rules={[
            {
              required: true,
              message: MESSAGE_REQUIRE,
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue(formFieldName.newPass) === value) {
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
          wrapperCol={{
            offset: 6,
            span: 8,
          }}
        >
          <Space>
            <Button type="primary" loading={loadingBtn} htmlType="submit">
              <CheckCircleOutlined />
              Lưu
            </Button>
            <Button
              type="primary"
              danger
              onClick={handleResetForm}
              disabled={disableResetBtn}
            >
              <CloseCircleOutlined />
              Hủy
            </Button>
          </Space>
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 6,
            span: 8,
          }}
        >
          <Link>Quên mật khẩu?</Link>
        </Form.Item>
      </Form>
    </>
  );
}

export default Password;
