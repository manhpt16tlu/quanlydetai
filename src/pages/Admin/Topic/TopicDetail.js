import {
  ClearOutlined,
  DownloadOutlined,
  EditOutlined,
} from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Space,
  Spin,
} from 'antd';
import CustomDivider from 'components/General/CustomDivider';
import {
  antdIconFontSize,
  DATE_FORMAT as dateFormat,
  FILE_TYPE,
  MESSAGE_REQUIRE as messageRequire,
  ROLES,
  routes as routesConfig,
  TIMESTAMP_FORMAT,
  TOPIC_FILE_TYPE,
  TOPIC_RESULT_DEFAULT,
  TOPIC_STATUS_DEFAULT,
} from 'configs/general';

import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as fileService from 'services/UploadFileService';
import * as topicService from 'services/TopicService';
import * as statusService from 'services/TopicStatusService';
import * as resultService from 'services/TopicResultService';
import {
  capitalizeFirstLetterEachWord,
  getFileNameFromHeaderDisposition,
  openNotificationWithIcon,
} from 'utils/general';
import moment from 'moment';

import style from 'pages/Admin/Topic/Topic.module.scss';
import produce from 'immer';
import { useReducer } from 'react';
import { optionSelectFillOBJ } from 'utils/topicUtil';
const { TextArea } = Input;
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
  createDate: 'ngaytao',
};
const initFormData = {
  data: {
    [formFieldNames.name]: undefined,
    [formFieldNames.organ]: undefined,
    [formFieldNames.manager]: undefined,
    [formFieldNames.field]: undefined,
    [formFieldNames.status]: undefined,
    [formFieldNames.result]: undefined,
    [formFieldNames.time]: undefined,
    [formFieldNames.expense]: undefined,
  },
  option: {
    [formFieldNames.status]: [],
    [formFieldNames.result]: [],
  },
};
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH':
      // prettier-ignore
      return produce(state, (draft) => {
        //dùng immer nên có thể mutate state
        draft.data[formFieldNames.organ] = action.payload.data[formFieldNames.organ];
        draft.data[formFieldNames.time] = action.payload.data[formFieldNames.time];
        draft.data[formFieldNames.createDate] = action.payload.data[formFieldNames.createDate];
        draft.data[formFieldNames.field] = action.payload.data[formFieldNames.field];
        draft.data[formFieldNames.name] = action.payload.data[formFieldNames.name];
        draft.data[formFieldNames.manager] = action.payload.data[formFieldNames.manager];
        draft.data[formFieldNames.expense] = action.payload.data[formFieldNames.expense];
        draft.data[formFieldNames.status] = action.payload.data[formFieldNames.status];
        draft.data[formFieldNames.result] = action.payload.data[formFieldNames.result];
        
        draft.option[formFieldNames.result] = action.payload.option[formFieldNames.result];
        draft.option[formFieldNames.status] = action.payload.option[formFieldNames.status];
      
      });
    default:
      return state;
  }
};
const generateTopicRequestBody = (data) => {
  return {
    name: data[formFieldNames.name],
    startDate: data[formFieldNames.time][0],
    endDate: data[formFieldNames.time][1],
    expense: data[formFieldNames.expense],
    topicStatus: JSON.parse(data[formFieldNames.status]),
    topicResult: JSON.parse(data[formFieldNames.result] ?? null),
  };
};
function TopicDetail() {
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const topicId = location.state?.['topicId'] ?? null;
  const previousPath = location.state?.['previousPath'] ?? null;

  const [loading, setLoading] = useState(false);

  const [formData, dispatch] = useReducer(reducer, initFormData);
  const [disableResetBtn, setDisableResetBtn] = useState(true);
  const [reload, setReload] = useState(false);
  const onFinish = (values) => {
    topicService
      .update(generateTopicRequestBody(values), topicId)
      .then(() => {
        setReload((prev) => !prev);
        setDisableResetBtn(true);
        openNotificationWithIcon('success', 'Cập nhật đề tài', 'top');
      })
      .catch((err) => {
        console.log(err);
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
      filterOption: (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
      options: optionsData,
    };
  };
  useEffect(() => {
    const callApi = async () => {
      try {
        if (topicId) {
          setLoading(true);
          const topic = (await topicService.getById(topicId))?.data;
          if (topic) {
            const statusList = (await statusService.getAll())?.data;
            const statusReallyNeed = statusList.filter(
              (status, i) =>
                ![TOPIC_STATUS_DEFAULT.CHUA_DUYET].includes(status.title)
            );
            const statusOptions = optionSelectFillOBJ(statusReallyNeed);

            const resultList = (await resultService.getAll())?.data;
            const resultOptions = optionSelectFillOBJ(resultList).map(
              (resultOption, i) => {
                if (resultOption.label === TOPIC_RESULT_DEFAULT.KHONG_XAC_DINH)
                  return produce(resultOption, (draft) => {
                    draft.label = 'Đề tài chưa được đánh giá';
                  });
                else return resultOption;
              }
            );

            // prettier-ignore
            dispatch({
              type: 'FETCH',
              payload: {
                data: {
                  [formFieldNames.name]: topic.name,
                  [formFieldNames.time]: [moment(topic.startDate, dateFormat),moment(topic.endDate, dateFormat)],
                  [formFieldNames.organ]: topic.manager.organ.name,
                  [formFieldNames.manager]: `${topic.manager.rank.name ?? ''}. ${capitalizeFirstLetterEachWord(topic.manager.name)}`,
                  [formFieldNames.field]: topic.topicField.title,
                  [formFieldNames.status]: JSON.stringify(topic.topicStatus),
                  [formFieldNames.result]:JSON.stringify(topic.topicResult),
                  [formFieldNames.expense]: topic.expense,
                  [formFieldNames.createDate]: moment(topic.createDate).format(TIMESTAMP_FORMAT),
                },
                option: {
                  [formFieldNames.status]:statusOptions,
                  [formFieldNames.result]:resultOptions
                },
              },
            });
            setLoading(false);
          }
        } else navigate(routesConfig.notFoundNavigate, { replace: true });
      } catch (error) {
        console.log(error);
        message.error('Có lỗi xảy ra');
      }
    };
    callApi();
  }, [reload]);
  useEffect(() => {
    form.resetFields();
  }, [formData]);
  const handleFormValuesChange = (changedValues, allValues) => {
    setDisableResetBtn(false);
  };
  const handleResetForm = () => {
    form.resetFields();
    setDisableResetBtn(true);
  };
  const handleDownloadFile = async (topicFileType) => {
    const fileNeedDownload = (
      await fileService.getTopicFilesByTopicIdAndTopicFileType(
        topicId,
        topicFileType
      )
    ).data;

    if (fileNeedDownload)
      fileService
        .download(FILE_TYPE.topic, fileNeedDownload.fileCode, {
          responseType: 'blob',
        })
        .then((response) => {
          //get filename from header
          const disposition = response.headers['content-disposition'];
          const filename = getFileNameFromHeaderDisposition(disposition);
          const a = document.createElement('a');
          const url = URL.createObjectURL(response.data);
          a.href = url;
          a.download = filename;
          a.click();
          URL.revokeObjectURL(url);
        })
        .catch((err) => {
          console.log(err);
          message.error('File không tồn tại');
        });
    else message.error('File không tồn tại');
  };

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to={routesConfig[ROLES.admin].home}>Trang chủ</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Đề tài</Breadcrumb.Item>
        <Breadcrumb.Item>
          {previousPath === routesConfig[ROLES.admin].topicList ? (
            <Link to={routesConfig[ROLES.admin].topicList}>Danh sách</Link>
          ) : (
            <Link to={routesConfig[ROLES.admin].topicApprove}>Phê duyệt</Link>
          )}
        </Breadcrumb.Item>
        <Breadcrumb.Item>Chi tiết</Breadcrumb.Item>
      </Breadcrumb>
      <CustomDivider text={'Chi tiết đề tài'} />

      <Spin spinning={loading}>
        {previousPath === routesConfig[ROLES.admin].topicList ? (
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
            initialValues={formData.data}
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
            <Form.Item label="Cơ quan chủ trì" name={formFieldNames.organ}>
              <Input className={style.disableInput} readOnly />
            </Form.Item>
            <Form.Item label="Chủ nhiệm" name={formFieldNames.manager}>
              <Input className={style.disableInput} readOnly />
            </Form.Item>
            <Form.Item label="Lĩnh vực" name={formFieldNames.field}>
              <Input className={style.disableInput} readOnly />
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
                {...getSelectProps(formData.option[formFieldNames.status])}
              />
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prev, curr) => {
                return (
                  prev[formFieldNames.status] !== curr[formFieldNames.status]
                );
              }}
            >
              {/* check status change */}
              {({ getFieldValue }) => {
                // prettier-ignore
                const currentStatus = JSON.parse(getFieldValue(formFieldNames.status) ?? null);
                return currentStatus?.title ===
                  TOPIC_STATUS_DEFAULT.DA_NGHIEM_THU ? (
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
                    <Select
                      {...getSelectProps(
                        formData.option[formFieldNames.result]
                      )}
                    />
                  </Form.Item>
                ) : null;
              }}
            </Form.Item>

            <Form.Item
              wrapperCol={{
                span: 6,
              }}
              label="Ngày tạo"
              name={formFieldNames.createDate}
            >
              <Input className={style.disableInput} readOnly />
            </Form.Item>

            <Form.Item label="Đề cương">
              <Button
                onClick={() => handleDownloadFile(TOPIC_FILE_TYPE.outline)}
              >
                <DownloadOutlined
                  style={{
                    fontSize: antdIconFontSize,
                  }}
                />
                Tải xuống
              </Button>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 6,
                span: 12,
              }}
            >
              <Space size="large">
                <Button
                  danger
                  type="primary"
                  disabled={disableResetBtn}
                  onClick={handleResetForm}
                >
                  <ClearOutlined
                    style={{
                      fontSize: antdIconFontSize,
                    }}
                  />
                  Hủy
                </Button>
                <Button
                  type="primary"
                  disabled={disableResetBtn}
                  htmlType="submit"
                >
                  <EditOutlined
                    style={{
                      fontSize: antdIconFontSize,
                    }}
                  />
                  Cập nhật
                </Button>
              </Space>
            </Form.Item>
          </Form>
        ) : (
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
            layout="horizontal"
            initialValues={formData.data}
          >
            <Form.Item label="Tên đề tài" name={formFieldNames.name}>
              <TextArea
                className={style.disableInput}
                autoSize={{
                  minRows: 1,
                  maxRows: 2,
                }}
                readOnly
              />
            </Form.Item>
            <Form.Item label="Cơ quan chủ trì" name={formFieldNames.organ}>
              <Input className={style.disableInput} readOnly />
            </Form.Item>
            <Form.Item label="Chủ nhiệm" name={formFieldNames.manager}>
              <Input className={style.disableInput} readOnly />
            </Form.Item>
            <Form.Item label="Lĩnh vực" name={formFieldNames.field}>
              <Input className={style.disableInput} readOnly />
            </Form.Item>
            <Form.Item label="Thời gian thực hiện" name={formFieldNames.time}>
              <RangePicker
                className={style.disableInput}
                style={{
                  width: 250,
                }}
                format={dateFormat}
                inputReadOnly
              />
            </Form.Item>
            <Form.Item label="Kinh phí" name={formFieldNames.expense}>
              <InputNumber
                readOnly
                className={style.disableInput}
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
            <Form.Item label="Trạng thái">
              <Input
                className={style.disableInput}
                readOnly
                defaultValue={TOPIC_STATUS_DEFAULT.CHUA_DUYET}
              />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                span: 6,
              }}
              label="Ngày tạo"
              name={formFieldNames.createDate}
            >
              <Input className={style.disableInput} readOnly />
            </Form.Item>

            <Form.Item label="Đề cương">
              <Button
                onClick={() => handleDownloadFile(TOPIC_FILE_TYPE.outline)}
              >
                <DownloadOutlined
                  style={{
                    fontSize: antdIconFontSize,
                  }}
                />
                Tải xuống
              </Button>
            </Form.Item>
          </Form>
        )}
      </Spin>
    </>
  );
}
export default TopicDetail;
