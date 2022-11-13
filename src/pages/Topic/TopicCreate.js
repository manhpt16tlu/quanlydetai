import { useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, InputNumber, Select } from 'antd';
import {
  MESSAGE_REQUIRE as messageRequire,
  DATE_FORMAT as dateFormat,
  DEFAULT_TOPIC_VALUES,
  DATE_FORMAT,
} from 'configs/general';
import { toast, ToastContainer } from 'react-toastify';
import * as fieldService from 'services/TopicField';
import * as organService from 'services/OrganService';
import * as countService from 'services/CountService';
import * as resultService from 'services/TopicResultService';
import * as statusService from 'services/TopicStatusService';
import * as topicService from 'services/TopicService';
import { optionSelectFill as optionFill } from 'utils/topicUtil';

function TopicCreate() {
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;
  const formFieldNames = {
    name: 'tendetai',
    organ: 'coquanchutri',
    manager: 'chunhiem',
    field: 'linhvuc',
    status: 'trangthai',
    result: 'ketqua',
    time: 'thoigianthuchien',
    expense: 'kinhphi',
  };
  const [fieldOptions, setFieldOptions] = useState([]);
  const [organOptions, setOrganOptions] = useState([]);
  const [resultOptions, setResultOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const getSelectProps = (optionsData) => {
    return {
      allowClear: true,
      showSearch: true,
      optionFilterProp: 'label',
      filterOption: (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
      options: optionsData,
    };
  };

  const onFinish = (values) => {
    countService
      .countTopicByName(values[formFieldNames.name])
      .then((data) => {
        if (data.data != 0) {
          // check exist name
          toast.error('Tên đề tài đã được đăng kí', {
            position: toast.POSITION.TOP_CENTER,
          });
          return;
        } else {
          //insert new record
          const sdate = values[formFieldNames.time][0].format(DATE_FORMAT);
          const edate = values[formFieldNames.time][1].format(DATE_FORMAT);
          toast.promise(
            topicService
              .create(
                {
                  name: values[formFieldNames.name],
                  manager: values[formFieldNames.manager],
                  startDate: sdate,
                  endDate: edate,
                  expense: values[formFieldNames.expense],
                },
                values[formFieldNames.organ],
                values[formFieldNames.field],
                values[formFieldNames.status],
                values[formFieldNames.result]
              )
              .then((data) => {
                form.resetFields();
              }),
            {
              pending: 'Pending',
              success: 'Tạo đề tài thành công',
              error: 'Có lỗi xảy ra',
            },
            { position: toast.POSITION.TOP_CENTER }
          );
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error('Có lỗi xảy ra', {
          position: toast.POSITION.TOP_CENTER,
        });
      });
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  useEffect(() => {
    fieldService.getAll().then((data) => {
      const temp = optionFill(data.data);
      setFieldOptions(temp);
    });
    organService.getAllNoPaging().then((data) => {
      const temp = optionFill(data.data);
      setOrganOptions(temp);
    });
    statusService.getAll().then((data) => {
      const temp = optionFill(data.data);
      setStatusOptions(temp);
    });
    resultService.getAll().then((data) => {
      const temp = optionFill(data.data);
      setResultOptions(temp);
    });
  }, []);
  return (
    <>
      <Form
        form={form}
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 12,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="horizontal"
        initialValues={{}}
        size="default"
      >
        <Form.Item
          label="Tên đề tài"
          name={formFieldNames.name}
          rules={[
            {
              required: true,
              message: messageRequire,
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
          label="Cơ quan chủ trì"
          name={formFieldNames.organ}
          rules={[
            {
              required: true,
              message: messageRequire,
            },
          ]}
        >
          <Select {...getSelectProps(organOptions)} />
        </Form.Item>
        <Form.Item
          label="Chủ nhiệm"
          name={formFieldNames.manager}
          rules={[
            {
              required: true,
              message: messageRequire,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Lĩnh vực"
          name={formFieldNames.field}
          rules={[
            {
              required: true,
              message: messageRequire,
            },
          ]}
        >
          <Select
            allowClear
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={fieldOptions}
          />
        </Form.Item>
        <Form.Item
          label="Thời gian thực hiện"
          name={formFieldNames.time}
          rules={[
            {
              required: true,
              message: messageRequire,
            },
          ]}
        >
          <RangePicker
            style={{
              width: 250,
            }}
            format={dateFormat}
          />
        </Form.Item>
        <Form.Item
          label="Kinh phí"
          name={formFieldNames.expense}
          rules={[
            {
              required: true,
              message: messageRequire,
            },
          ]}
        >
          <InputNumber
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            style={{
              width: 250,
            }}
            step="500000"
            min="0"
          />
        </Form.Item>
        <Form.Item
          label="Trạng thái"
          name={formFieldNames.status}
          rules={[
            {
              required: true,
              message: messageRequire,
            },
          ]}
        >
          <Select {...getSelectProps(statusOptions)} />
        </Form.Item>
        <Form.Item
          label="Kết quả"
          name={formFieldNames.result}
          rules={[
            {
              required: true,
              message: messageRequire,
            },
          ]}
        >
          <Select {...getSelectProps(resultOptions)} />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 13,
            span: 3,
          }}
        >
          <Button type="primary" block htmlType="submit">
            Tạo mới
          </Button>
        </Form.Item>
      </Form>
      <ToastContainer autoClose={1200} />
    </>
  );
}

export default TopicCreate;
