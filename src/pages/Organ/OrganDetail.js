import { useLocation, useNavigate } from 'react-router';
import { useState } from 'react';
import { Space, Button, Form, Input, Statistic, Row, Col } from 'antd';
import { toast, ToastContainer } from 'react-toastify';
import * as organService from 'services/OrganService';

function OrganDetail() {
  const { TextArea } = Input;
  const navigage = useNavigate();
  const formFieldNames = {
    name: 'ten',
    address: 'diachi',
  };
  const location = useLocation();
  const [update, setUpdate] = useState(false);
  const organ = location.state;
  const updateProcess = (values) => {
    return organService
      .update(
        {
          name: values[formFieldNames.name],
          address: values[formFieldNames.address],
        },
        organ.id
      )
      .then(() => {
        setUpdate(false);
        navigage(location.pathname, {
          state: {
            id: organ.id,
            name: values[formFieldNames.name],
            address: values[formFieldNames.address],
          },
        });
      });
  };
  const onFinish = (values) => {
    toast.promise(
      () => updateProcess(values),
      {
        pending: 'Pending',
        success: 'Cập nhật thành công',
        error: 'Có lỗi xảy ra',
      },
      { position: toast.POSITION.BOTTOM_CENTER }
    );
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const onDisable = () => {
    console.log('disable');
  };
  const onChange = (e) => {
    setUpdate(true);
  };
  return (
    <>
      <Form
        name="basic"
        labelCol={{
          span: 3,
        }}
        wrapperCol={{
          span: 10,
        }}
        initialValues={{
          [formFieldNames.name]: organ.name,
          [formFieldNames.address]: organ.address,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Tên cơ quan"
          name={formFieldNames.name}
          rules={[
            {
              required: true,
              message: 'Không được để trống',
            },
          ]}
        >
          <TextArea
            autoSize={{
              minRows: 1,
              maxRows: 2,
            }}
            name={formFieldNames.name}
            onChange={onChange}
          />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name={formFieldNames.address}
          rules={[
            {
              required: true,
              message: 'Không được để trống',
            },
          ]}
        >
          <TextArea
            autoSize={{
              minRows: 1,
              maxRows: 2,
            }}
            name={formFieldNames.address}
            onChange={onChange}
          />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 3,
            span: 16,
          }}
        >
          <Space size="middle">
            <Button disabled={!update} type="primary" htmlType="submit">
              Cập nhật
            </Button>
            <Button disabled={false} danger type="primary" onClick={onDisable}>
              Vô hiệu hóa
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <Row gutter={16}>
        <Col span={5}>
          <Statistic title="Đề tài đã phê duyệt" value={5} />
        </Col>
        <Col span={5}>
          <Statistic title="Đề tài chờ phê duyệt" value={1} />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={5}>
          <Statistic title="Đề tài đã nghiệm thu" value={0} />
        </Col>
        <Col span={5}>
          <Statistic title="Đề tài đang thực hiện" value={3} />
        </Col>
      </Row>
      <ToastContainer autoClose={1200} />
    </>
  );
}

export default OrganDetail;
