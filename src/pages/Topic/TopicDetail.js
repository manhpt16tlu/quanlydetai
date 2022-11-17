import { DoubleLeftOutlined } from '@ant-design/icons';
import {
  Affix,
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
} from 'antd';
import {
  DATE_FORMAT as dateFormat,
  MESSAGE_REQUIRE as messageRequire,
  routes as routesConfig,
} from 'configs/general';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as organService from 'services/OrganService';
import * as fieldService from 'services/TopicFieldService';
import * as resultService from 'services/TopicResultService';
import * as topicService from 'services/TopicService';
import * as statusService from 'services/TopicStatusService';
import { openNotificationWithIcon } from 'utils/general';
import { optionSelectFill } from 'utils/topicUtil';

function TopicDetail() {
  const { TextArea } = Input;
  const { RangePicker } = DatePicker;
  const [form] = Form.useForm();
  const location = useLocation();
  const topicId = location.state?.topicID;
  const navigate = useNavigate();

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
  const getNewData = async (values) => {
    const newField = await fieldService.getById(values[formFieldNames.field]);
    const newStatus = await statusService.getById(
      values[formFieldNames.status]
    );
    const newResult = await resultService.getById(
      values[formFieldNames.result] ?? 5
    );
    return {
      topicField: newField.data, // must .data because newField include status,message,...
      topicStatus: newStatus.data,
      topicResult: newResult.data,
      name: values[formFieldNames.name],
      manager: values[formFieldNames.manager],
      expense: values[formFieldNames.expense],
      startDate: values[formFieldNames.time][0].format(dateFormat),
      endDate: values[formFieldNames.time][1].format(dateFormat),
    };
  };
  const [bottom, setBottom] = useState(10);
  const [fieldOptions, setFieldOptions] = useState([]);
  const [organOptions, setOrganOptions] = useState([]);
  const [resultOptions, setResultOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [initFormData, setInitFormData] = useState({
    [formFieldNames.name]: undefined,
    [formFieldNames.organ]: undefined,
    [formFieldNames.manager]: undefined,
    [formFieldNames.field]: undefined,
    [formFieldNames.status]: undefined,
    [formFieldNames.result]: undefined,
    [formFieldNames.time]: undefined,
    [formFieldNames.expense]: undefined,
  });
  const [disableBtn, setDisableBtn] = useState(true);
  const [reload, setReload] = useState(false);
  const onFinish = async (values) => {
    const body = await getNewData(values);
    topicService
      .update(body, topicId)
      .then(() => {
        setDisableBtn(true);
        setReload(true);
        openNotificationWithIcon('success', 'Cập nhật đề tài', 'top');
      })
      .catch(() => {
        openNotificationWithIcon('error', 'Cập nhật đề tài', 'top');
      });
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
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
  useEffect(() => {
    if (topicId) {
      console.log('call api');
      topicService.getById(topicId).then((data) => {
        const topic = data.data;
        setInitFormData({
          [formFieldNames.name]: topic.name,
          [formFieldNames.time]: [
            moment(topic.startDate, dateFormat),
            moment(topic.endDate, dateFormat),
          ],
          [formFieldNames.organ]: topic.organ.id,
          [formFieldNames.manager]: topic.manager,
          [formFieldNames.field]: topic.topicField.id,
          [formFieldNames.status]: topic.topicStatus.id,
          [formFieldNames.result]: topic.topicResult.id,
          [formFieldNames.expense]: topic.expense,
        });
      });
      fieldService.getAll().then((data) => {
        const temp = optionSelectFill(data.data);
        setFieldOptions(temp);
      });
      organService.getAllNoPaging().then((data) => {
        const temp = optionSelectFill(data.data);
        setOrganOptions(temp);
      });
      statusService.getAll().then((data) => {
        const temp = optionSelectFill(data.data);
        setStatusOptions(temp);
      });
      resultService.getAll().then((data) => {
        const temp = optionSelectFill(data.data);
        setResultOptions(temp);
      });
    } else navigate(routesConfig.notfoundRedirect);
  }, [reload]);
  useEffect(() => {
    form.resetFields();
  }, [initFormData]);
  const onFormDataChange = (values) => {
    setDisableBtn(false);
  };
  const resetForm = () => {
    form.resetFields();
    setDisableBtn(true);
  };
  console.log('topic detail render');
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
        initialValues={initFormData}
        size="default"
        onValuesChange={onFormDataChange}
        style={{ marginBottom: 100 }}
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
          <Select {...getSelectProps(organOptions)} disabled />
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
          noStyle
          shouldUpdate={(prev, curr) =>
            prev[formFieldNames.status] !== curr[formFieldNames.status]
          }
        >
          {/* check status change */}
          {({ getFieldValue }) =>
            getFieldValue(formFieldNames.status) === 3 ? (
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
            ) : null
          }
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 12,
            span: 5,
          }}
        >
          <Space size="large">
            <Button type="primary" disabled={disableBtn} onClick={resetForm}>
              Đặt lại
            </Button>
            <Button type="primary" disabled={disableBtn} htmlType="submit">
              Cập nhật
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <Affix offsetBottom={bottom}>
        <Button type="primary" onClick={() => navigate(-1)}>
          <DoubleLeftOutlined /> Quay lại
        </Button>
      </Affix>
    </>
  );
}
export default TopicDetail;
