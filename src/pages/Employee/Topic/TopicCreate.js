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
  Breadcrumb,
} from 'antd';
import {
  antdIconFontSize,
  DATE_FORMAT as dateFormat,
  DATE_FORMAT,
  MESSAGE_REQUIRE as messageRequire,
  MIME_TYPE,
  MAX_FILE_SIZE,
  TOPIC_FILE_TYPE,
  routes as routesConfig,
  ROLES,
} from 'configs/general';
import { useEffect, useReducer, useState } from 'react';
import * as countService from 'services/CountService';
import * as organService from 'services/OrganService';
import * as fieldService from 'services/TopicFieldService';
import * as resultService from 'services/TopicResultService';
import * as topicService from 'services/TopicService';
import * as statusService from 'services/TopicStatusService';
import * as fileService from 'services/UploadFileService';
import * as userService from 'services/UserService';
import {
  openNotificationWithIcon,
  capitalizeFirstLetterEachWord,
} from 'utils/general';
import { optionSelectFill, optionSelectFillOBJ } from 'utils/topicUtil';
import CustomDivider from 'components/General/CustomDivider';
import * as authService from 'services/AuthService';
import produce from 'immer';
import style from 'pages/Employee/Topic/Topic.module.scss';
import { Link } from 'react-router-dom';
const { RangePicker } = DatePicker;
const { TextArea } = Input;
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
const initFormData = {
  user: undefined,
  data: {
    [formFieldNames.organ]: undefined,
    [formFieldNames.manager]: undefined,
    [formFieldNames.status]: undefined,
  },
  option: {
    [formFieldNames.field]: [],
  },
};

const formReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH':
      return produce(state, (draft) => {
        //dùng immer nên có thể mutate state
        draft.user = action.payload.user;
        draft.option[formFieldNames.field] =
          action.payload.option[formFieldNames.field];
        draft.data[formFieldNames.status] =
          action.payload.data[formFieldNames.status];
        draft.data[formFieldNames.organ] =
          action.payload.data[formFieldNames.organ];
        draft.data[formFieldNames.manager] =
          action.payload.data[formFieldNames.manager];
      });

    default:
      return state;
  }
};
function TopicCreate() {
  const userStorage = authService.getCurrentUser();
  const [form] = Form.useForm();
  const [disableResetBtn, setDisableResetBtn] = useState(true);
  const [formData, dispatch] = useReducer(formReducer, initFormData);

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
    topicService
      .existByName(values[formFieldNames.name])
      .then((data) => {
        if (data.data) {
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
            .employeeCreate({
              name: values[formFieldNames.name],
              manager: formData.user,
              startDate: sdate,
              endDate: edate,
              expense: values[formFieldNames.expense],
              topicField: JSON.parse(values[formFieldNames.field]),
            })
            .then((data) => {
              createdTopicId = data.data.id;
              const formData = new FormData();
              //upload 1 file,viết foreach có thể handle nhiều file
              values[formFieldNames.file].forEach((file, index) => {
                formData.append('fileUpload', file.originFileObj); // có thể k cần originFileObj
              });
              formData.append('topicFileType', TOPIC_FILE_TYPE.outline);
              formData.append('topic', data.data.id);
              return fileService.uploadTopicFile(formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
            })
            .then((data) => {
              openNotificationWithIcon('success', 'Đề xuất đề tài', 'top');
              handleResetForm(); //clear form
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
    form.resetFields();
  }, [formData]);
  useEffect(() => {
    const callApi = async () => {
      console.log('call api');
      try {
        const userData = (
          await userService.getUserByUsername(userStorage?.username)
        )?.data;

        const fieldList = (await fieldService.getAll())?.data;
        dispatch({
          type: 'FETCH',
          payload: {
            user: userData,
            data: {
              [formFieldNames.organ]: userData?.organ?.name,
              [formFieldNames.manager]: `${
                userData?.rank?.name ?? ''
              }. ${capitalizeFirstLetterEachWord(userData.name)}`,
              [formFieldNames.status]: 'Chưa duyệt',
            },
            option: {
              [formFieldNames.field]: optionSelectFillOBJ(fieldList),
            },
          },
        });
      } catch (error) {
        message.error('Có lỗi xảy ra');
      }
    };
    callApi();
    // fieldService.getAll().then((data) => {
    //   const temp = optionSelectFill(data.data);
    //   setFieldOptions(temp);
    // });

    // statusService.getAll().then((data) => {
    //   const temp = optionSelectFillOBJ(data.data);
    //   setStatusOptions(temp);
    // });
    // resultService.getAll().then((data) => {
    //   const temp = optionSelectFill(data.data);
    //   setResultOptions(temp);
    // });
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
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to={routesConfig[ROLES.employee].home}>Trang chủ</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Đề tài</Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={routesConfig[ROLES.employee].topicList}>Đề xuất</Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <CustomDivider text={'Đề xuất đề tài'} />
      <Form
        labelAlign="left"
        form={form}
        labelCol={{
          offset: 3,
          span: 3,
        }}
        wrapperCol={{
          span: 12,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="horizontal"
        onValuesChange={handleFormValuesChange}
        initialValues={formData.data}
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
        <Form.Item label="Cơ quan chủ trì" name={formFieldNames.organ}>
          <Input className={style.disableInput} readOnly />
        </Form.Item>
        <Form.Item label="Chủ nhiệm" name={formFieldNames.manager}>
          <Input className={style.disableInput} readOnly />
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
            optionFilterProp="label"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={formData.option[formFieldNames.field]}
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
        <Form.Item label="Trạng thái" name={formFieldNames.status}>
          <Input className={style.disableInput} readOnly />
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
              Đề xuất
            </Button>
            <Button
              type="primary"
              disabled={disableResetBtn}
              onClick={handleResetForm}
              danger
            >
              <ClearOutlined
                style={{
                  fontSize: antdIconFontSize,
                }}
              />
              Hủy
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
}

export default TopicCreate;
