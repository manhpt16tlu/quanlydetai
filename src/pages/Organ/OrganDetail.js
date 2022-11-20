import { DoubleLeftOutlined } from '@ant-design/icons';
import { Affix, Button, Col, Form, Input, Row, Space, Statistic } from 'antd';
import { MESSAGE_REQUIRE } from 'configs/general';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import * as countService from 'services/CountService';
import * as organService from 'services/OrganService';
function OrganDetail() {
  const { TextArea } = Input;
  const navigate = useNavigate();
  const formFieldNames = {
    name: 'ten',
    address: 'diachi',
  };
  const [bottom, setBottom] = useState(20);
  const location = useLocation();
  const [update, setUpdate] = useState(false);
  const organ = location.state;
  const [statistic, setStatistic] = useState({
    stat1: 0, //chờ duyệt
    stat2: 0, //đang thực hiện
    stat3: 0, //đã nghiệm thu
    stat4: 0, //đã duyệt
  });
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
        navigate(location.pathname, {
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
  useEffect(() => {
    countService.countTopicByStatus(organ.id, 1).then((data) => {
      setStatistic((prev) => ({
        ...prev,
        stat1: data.data,
      }));
    });
    countService.countTopicByStatus(organ.id, 2).then((data) => {
      setStatistic((prev) => ({
        ...prev,
        stat2: data.data,
      }));
    });
    countService.countTopicByStatus(organ.id, 3).then((data) => {
      setStatistic((prev) => ({
        ...prev,
        stat3: data.data,
      }));
    });
    countService.countTopicByStatus(organ.id, 4).then((data) => {
      setStatistic((prev) => ({
        ...prev,
        stat4: data.data,
      }));
    });
  }, []);
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
        onValuesChange={onChange}
        autoComplete="off"
      >
        <Form.Item
          label="Tên cơ quan"
          name={formFieldNames.name}
          rules={[
            {
              required: true,
              message: MESSAGE_REQUIRE,
            },
          ]}
        >
          <TextArea
            autoSize={{
              minRows: 1,
              maxRows: 2,
            }}
          />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name={formFieldNames.address}
          rules={[
            {
              required: true,
              message: MESSAGE_REQUIRE,
            },
          ]}
        >
          <TextArea
            autoSize={{
              minRows: 1,
              maxRows: 2,
            }}
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
          <Statistic title="Đề tài đã phê duyệt" value={statistic.stat4} />
        </Col>
        <Col span={5}>
          <Statistic title="Đề tài chờ phê duyệt" value={statistic.stat1} />
        </Col>
      </Row>
      <Space
        direction="vertical"
        size={300}
        style={{
          display: 'flex',
        }}
      >
        <Row gutter={16}>
          <Col span={5}>
            <Statistic title="Đề tài đã nghiệm thu" value={statistic.stat3} />
          </Col>
          <Col span={5}>
            <Statistic title="Đề tài đang thực hiện" value={statistic.stat2} />
          </Col>
        </Row>
        <Affix offsetBottom={bottom}>
          <Button type="primary" onClick={() => navigate(-1)}>
            <DoubleLeftOutlined /> Quay lại
          </Button>
        </Affix>
      </Space>
      <ToastContainer autoClose={1200} />
    </>
  );
}

export default OrganDetail;
