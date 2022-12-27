import { DownloadOutlined } from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Spin,
} from 'antd';
import CustomDivider from 'components/General/CustomDivider';
import {
  antdIconFontSize,
  DATE_FORMAT as dateFormat,
  FILE_TYPE,
  ROLES,
  routes as routesConfig,
  TIMESTAMP_FORMAT,
  TOPIC_FILE_TYPE,
} from 'configs/general';
import produce from 'immer';
import moment from 'moment';
import style from 'pages/Employee/Topic/Topic.module.scss';
import { useEffect, useReducer, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as topicService from 'services/TopicService';
import * as fileService from 'services/UploadFileService';
import {
  capitalizeFirstLetterEachWord,
  getFileNameFromHeaderDisposition,
} from 'utils/general';
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
    [formFieldNames.organ]: undefined,
    [formFieldNames.manager]: undefined,
    [formFieldNames.status]: undefined,
    [formFieldNames.name]: undefined,
    [formFieldNames.result]: undefined,
    [formFieldNames.time]: undefined,
    [formFieldNames.createDate]: undefined,
    [formFieldNames.expense]: undefined,
    [formFieldNames.field]: undefined,
  },
};
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH':
      return produce(state, (draft) => {
        //dùng immer nên có thể mutate state
        draft.data[formFieldNames.organ] = action.payload[formFieldNames.organ];
        draft.data[formFieldNames.time] = action.payload[formFieldNames.time];
        draft.data[formFieldNames.createDate] =
          action.payload[formFieldNames.createDate];
        draft.data[formFieldNames.field] = action.payload[formFieldNames.field];
        draft.data[formFieldNames.name] = action.payload[formFieldNames.name];
        draft.data[formFieldNames.manager] =
          action.payload[formFieldNames.manager];
        draft.data[formFieldNames.expense] =
          action.payload[formFieldNames.expense];
        draft.data[formFieldNames.status] =
          action.payload[formFieldNames.status];
        draft.data[formFieldNames.result] =
          action.payload[formFieldNames.result];
      });
    default:
      return state;
  }
};
function TopicDetail() {
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const topicId = location.state?.['topicId'] ?? null;
  const previousPath = location.state?.previousPath;
  const [loading, setLoading] = useState(false);
  const [formData, dispatch] = useReducer(reducer, initFormData);

  useEffect(() => {
    const callApi = async () => {
      try {
        if (topicId) {
          console.log('call api');
          setLoading(true); // display loading icon
          const topic = (await topicService.getById(topicId))?.data;

          if (topic) {
            dispatch({
              type: 'FETCH',
              payload: {
                [formFieldNames.name]: topic.name,
                [formFieldNames.time]: [
                  moment(topic.startDate, dateFormat),
                  moment(topic.endDate, dateFormat),
                ],
                [formFieldNames.organ]: topic.manager.organ.name,
                [formFieldNames.manager]: `${
                  topic.manager.rank.name ?? ''
                }. ${capitalizeFirstLetterEachWord(topic.manager.name)}`,
                [formFieldNames.field]: topic.topicField.title,
                [formFieldNames.status]: topic.topicStatus.title,
                [formFieldNames.result]:
                  topic.topicResult.description ?? topic.topicResult.title,
                [formFieldNames.expense]: topic.expense,
                [formFieldNames.createDate]: moment(topic.createDate).format(
                  TIMESTAMP_FORMAT
                ),
              },
            });
            setLoading(false);
          }
        } else navigate(routesConfig.notFoundRedirect);
      } catch (error) {
        message.error('Có lỗi xảy ra');
      }
    };
    callApi();
  }, []);
  useEffect(() => {
    form.resetFields();
  }, [formData]);
  const handleDownloadFile = async () => {
    const fileNeedDownload = (
      await fileService.getTopicFilesByTopicIdAndTopicFileType(
        topicId,
        TOPIC_FILE_TYPE.outline
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
          <Link to={routesConfig[ROLES.employee].home}>Trang chủ</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Đề tài</Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={routesConfig[ROLES.employee].topicList}>Danh sách</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Chi tiết</Breadcrumb.Item>
      </Breadcrumb>
      <CustomDivider text={'Chi tiết đề tài'} />
      <Spin spinning={loading}>
        <Form
          form={form}
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 12,
          }}
          layout="horizontal"
          initialValues={formData.data}
          size="default"
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
          <Form.Item label="Trạng thái" name={formFieldNames.status}>
            <Input className={style.disableInput} readOnly />
          </Form.Item>

          <Form.Item label="Kết quả" name={formFieldNames.result}>
            <Input className={style.disableInput} readOnly />
          </Form.Item>

          <Form.Item label="Ngày tạo" name={formFieldNames.createDate}>
            <Input className={style.disableInput} readOnly />
          </Form.Item>

          <Form.Item label="Đề cương">
            <Button onClick={handleDownloadFile}>
              <DownloadOutlined
                style={{
                  fontSize: antdIconFontSize,
                }}
              />
              Tải xuống
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </>
  );
}
export default TopicDetail;
