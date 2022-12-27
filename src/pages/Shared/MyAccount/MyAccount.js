import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Form, Input, Space } from 'antd';
import CustomDivider from 'components/General/CustomDivider';
import { Link } from 'react-router-dom';
function MyAccount() {
  const onFinish = (values) => {
    console.log('Success:', values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link>Trang chủ</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Tài khoản của tôi</Breadcrumb.Item>
      </Breadcrumb>
      <CustomDivider size={5} text="Thông tin tài khoản" orientation="left" />
      <Form
        labelAlign="left"
        labelCol={{
          span: 4,
          offset: 1,
        }}
        wrapperCol={{
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
          label="Họ tên"
          name=""
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Tên tài khoản" name="">
          <Input />
        </Form.Item>
        <Form.Item label="Cơ quan trực thuộc" name="">
          <Input />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name=""
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name=""
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name=""
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Bằng cấp"
          name=""
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 5,
            span: 8,
          }}
        >
          <Space>
            <Button type="primary" htmlType="submit">
              <CheckCircleOutlined />
              Lưu
            </Button>
            <Button type="primary" danger disabled>
              <CloseCircleOutlined />
              Hủy
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
}

export default MyAccount;
