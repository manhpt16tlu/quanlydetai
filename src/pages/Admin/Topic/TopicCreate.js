import { PlusOutlined, UploadOutlined, ClearOutlined } from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Upload,
  message,
} from 'antd';
import {
  antdIconFontSize,
  DATE_FORMAT as dateFormat,
  DATE_FORMAT,
  MESSAGE_REQUIRE as messageRequire,
  MIME_TYPE,
  MAX_FILE_SIZE,
} from 'configs/general';
import { useEffect, useState } from 'react';
import * as countService from 'services/CountService';
import * as organService from 'services/OrganService';
import * as fieldService from 'services/TopicFieldService';
import * as resultService from 'services/TopicResultService';
import * as topicService from 'services/TopicService';
import * as statusService from 'services/TopicStatusService';
import * as fileService from 'services/UploadFileService';
import { openNotificationWithIcon } from 'utils/general';
import { optionSelectFill, optionSelectFillOBJ } from 'utils/topicUtil';
import CustomDivider from 'components/General/CustomDivider';
function TopicCreate() {
  console.log('topicCreate render');
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
    file: 'decuong',
  };
  const [fieldOptions, setFieldOptions] = useState([]);
  const [organOptions, setOrganOptions] = useState([]);
  const [resultOptions, setResultOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [disableResetBtn, setDisableResetBtn] = useState(true);
  let createdTopicId; //for rollback if have error

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
  const handleResetForm = () => {
    form.resetFields();
    setDisableResetBtn(true);
  };

  const handleFormValuesChange = (changedValues, allValues) => {
    // console.log(allValues);
    setDisableResetBtn(false);
  };
  const onFinish = (values) => {
    console.log('submit form data: ', values);
    countService
      .countTopicByName(values[formFieldNames.name])
      .then((data) => {
        if (data.data != 0) {
          // check exist name
          openNotificationWithIcon(
            'error',
            null,
            'top',
            'Tên đề tài đã được đăng kí'
          );
          return;
        } else {
          //insert new record
          const sdate = values[formFieldNames.time][0].format(DATE_FORMAT);
          const edate = values[formFieldNames.time][1].format(DATE_FORMAT);

          topicService
            .create(
              {
                // uid: uid(), //deprecated , create uid in backend
                name: values[formFieldNames.name],
                manager: values[formFieldNames.manager],
                startDate: sdate,
                endDate: edate,
                expense: values[formFieldNames.expense],
              },
              values[formFieldNames.organ],
              values[formFieldNames.field],
              JSON.parse(values[formFieldNames.status])?.id,
              values[formFieldNames.result]
            )
            .then((data) => {
              createdTopicId = data.data.id;
              const formData = new FormData();
              //upload 1 file,viết foreach có thể handle nhiều file
              values[formFieldNames.file].forEach((file, index) => {
                formData.append('fileUpload', file.originFileObj); // có thể k cần originFileObj
              });
              formData.append('topicFileType', 'Đề cương');
              formData.append('topic', data.data.id);

              return fileService.uploadTopicFile(formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
            })
            .then((data) => {
              openNotificationWithIcon('success', 'Tạo đề tài', 'top');
              form.resetFields(); //clear form
              setDisableResetBtn(true); //disable button clear
            })
            .catch((err) => {
              if (createdTopicId) {
                //delete record topic
                topicService.deleteById(createdTopicId).catch(() => {});
              }
              console.log(err);
              openNotificationWithIcon('error', 'Tạo đề tài', 'top');
            });
        }
      })
      .catch((err) => {
        console.log(err);
        openNotificationWithIcon('error', null, 'top');
      });
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  useEffect(() => {
    fieldService.getAll().then((data) => {
      const temp = optionSelectFill(data.data);
      setFieldOptions(temp);
    });
    organService.getAllNoPaging().then((data) => {
      const temp = optionSelectFill(data.data);
      setOrganOptions(temp);
    });
    statusService.getAll().then((data) => {
      const temp = optionSelectFillOBJ(data.data);
      setStatusOptions(temp);
    });
    resultService.getAll().then((data) => {
      const temp = optionSelectFill(data.data);
      setResultOptions(temp);
    });
  }, []);

  const getFileList = (e) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };
  const uploadProps = {
    beforeUpload: (file) => {
      //check file type upload
      if (!Object.values(MIME_TYPE).includes(file.type)) {
        message.error('Không hỗ trợ loại file này');
        return Upload.LIST_IGNORE;
      } else if (file.size > MAX_FILE_SIZE) {
        //check file zie
        message.error(
          `Không thể upload file lớn hơn ${Math.round(
            MAX_FILE_SIZE / 1000000
          )}MB`
        );
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    multiple: true,
    maxCount: 1,
  };
  return (
    <>
      <CustomDivider text={'Tạo đề tài'} />
      <Form
        form={form}
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 12,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="horizontal"
        // initialValues={{}}
        size="default"
        onValuesChange={handleFormValuesChange}
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
            placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
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
              `đ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={(value) => value.replace(/đ\s?|(,*)/g, '')}
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
          <Select
            {...getSelectProps(statusOptions)}
            // onChange={onStatusChange}
          />
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prev, curr) =>
            prev[formFieldNames.status] !== curr[formFieldNames.status]
          }
        >
          {/* check status change */}
          {({ getFieldValue }) => {
            const statusSelectObj = JSON.parse(
              getFieldValue(formFieldNames.status) ?? null
            );
            return (statusSelectObj?.title ?? statusSelectObj?.name) ===
              'Đã nghiệm thu' ? (
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
            ) : null;
          }}
        </Form.Item>

        <Form.Item
          getValueFromEvent={getFileList} // vì onchange upload return object
          valuePropName="fileList" // prop của child component chứa value
          name={formFieldNames.file}
          label="Đề cương"
          rules={[
            {
              required: true,
              message: messageRequire,
            },
          ]}
        >
          <Upload {...uploadProps}>
            <Button
              icon={
                <UploadOutlined
                  style={{
                    fontSize: antdIconFontSize,
                  }}
                />
              }
            >
              Chọn file
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 6,
          }}
        >
          <Space size="large">
            <Button type="primary" htmlType="submit">
              <PlusOutlined
                style={{
                  fontSize: antdIconFontSize,
                }}
              />
              Tạo mới
            </Button>
            <Button
              type="primary"
              disabled={disableResetBtn}
              onClick={handleResetForm}
            >
              <ClearOutlined
                style={{
                  fontSize: antdIconFontSize,
                }}
              />
              Đặt lại
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
}

export default TopicCreate;
