import { WarningOutlined } from '@ant-design/icons';
import {
  Form,
  Input,
  Space,
  Button,
  Typography,
  Avatar,
  Image,
  Row,
  Col,
  Upload,
  message,
  Select,
  Spin,
  Popconfirm,
} from 'antd';
import {
  AVATAR_MIME_TYPE,
  FILE_TYPE,
  MAX_AVATAR_SIZE,
  MESSAGE_REQUIRE,
  ROLES,
} from 'configs/general';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
} from '@ant-design/icons';
import produce from 'immer';
import { useContext, useEffect, useReducer, useState } from 'react';
import defaultAvatar from 'assets/images/default_avatar.jpg';
import * as userService from 'services/UserService';
import * as rankService from 'services/UserRankService';
import * as authService from 'services/AuthService';
import * as fileService from 'services/UploadFileService';
import * as avatarService from 'services/UserAvatarService';
import {
  getFileNameFromHeaderDisposition,
  openNotificationWithIcon,
} from 'utils/general';
import isEqual from 'lodash/isEqual';
import { LayoutContext as AdminLayoutContext } from 'components/Layouts/v2/admin/AppLayout';
import { LayoutContext as EmployeeLayoutContext } from 'components/Layouts/v2/employee/AppLayout';

const { Title } = Typography;
const { TextArea } = Input;
const formFieldName = {
  fullname: 'hoten',
  username: 'tentaikhoan',
  organ: 'coquan',
  address: 'diachi',
  sdt: 'sodienthoai',
  email: 'email',
  rank: 'bangcap',
  userId: 'manguoidung',
};
const disableInput = {
  pointerEvents: 'none',
};
const initFormData = {
  user: undefined,
  avatarResourceResponse: undefined,
  data: {
    [formFieldName.fullname]: undefined,
    [formFieldName.username]: undefined,
    [formFieldName.organ]: undefined,
    [formFieldName.rank]: undefined,
  },
  option: {
    [formFieldName.rank]: [],
  },
};
// prettier-ignore
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH':
      return produce(state, (draft) => {
        //dùng immer nên có thể mutate state
        draft.data[formFieldName.fullname]=action.payload.data[formFieldName.fullname];
        draft.data[formFieldName.username]=action.payload.data[formFieldName.username];
        draft.data[formFieldName.organ]=action.payload.data[formFieldName.organ];
        draft.data[formFieldName.rank]=action.payload.data[formFieldName.rank];
        draft.option[formFieldName.rank]=action.payload.option[formFieldName.rank];
        draft.user=action.payload.user;
        draft.avatarResourceResponse = action.payload.avatarResourceResponse;
      });

    default:
      return state;
  }
};
const generateRankOption = (data) => {
  //option with value is object
  return data.map((v, i) => {
    return {
      title: v.description ?? v.name ?? v.title, //hiển thị khi hover
      value: JSON.stringify(v),
      label: `${v.title ?? v.name} - ${v.description}`, // hiển thị ra giao diện
    };
  });
};
const generateUserRequestBody = (data) => {
  return {
    name: data[formFieldName.fullname].trim(),
    rank: JSON.parse(data[formFieldName.rank]),
  };
};
function Profile() {
  const userStorage = authService.getCurrentUser();
  const roles = userStorage?.roles;

  const [, setRefreshAvatarHeader] = useContext(
    roles?.includes(ROLES.admin) ? AdminLayoutContext : EmployeeLayoutContext
  );

  const [form] = Form.useForm();
  const [formData, dispatch] = useReducer(reducer, initFormData);
  const [disableResetBtn, setDisableResetBtn] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const onFinish = (values) => {
    //xem dữ liệu có thay đổi không
    if (!isEqual(values, formData.data)) {
      // console.log('change');
      userService
        .updateInformation(formData.user?.id, generateUserRequestBody(values))
        .then(() => {
          setRefresh((prev) => !prev);
          openNotificationWithIcon('success', 'Cập nhật tài khoản', 'top');
          setDisableResetBtn(true);
          // handleResetForm();
        })
        .catch((err) => {
          console.log(err);
          openNotificationWithIcon('error', 'Cập nhật tài khoản', 'top');
        });
      return;
    }
    openNotificationWithIcon('success', 'Cập nhật tài khoản', 'top');
    handleResetForm();
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const handleDeleteAvatar = async () => {
    try {
      await avatarService.removeAvatar();
      setRefresh((prev) => !prev);
      setRefreshAvatarHeader((prev) => !prev);
      message.success('Xóa thành công');
    } catch (error) {
      console.log(error);
      message.error('Có lỗi xảy ra');
    }
  };
  const handleFormValuesChange = (changedValues, allValues) => {
    setDisableResetBtn(false);
  };
  const handleResetForm = () => {
    form.resetFields();
    setDisableResetBtn(true);
  };
  const uploadAvatar = async ({ file }) => {
    try {
      setAvatarLoading(true);
      const formData = new FormData();
      formData.append('fileUpload', file);
      await fileService.uploadAvatar(formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setRefresh((prev) => !prev);
      setRefreshAvatarHeader((prev) => !prev); // refresh avatar in header
      message.success('Cập nhật thành công');
    } catch (error) {
      console.log(error);
      message.error('Có lỗi xảy ra');
    }
  };
  const getAvatarFromResourceResponse = (response) => {
    if (response) {
      const url = URL.createObjectURL(response.data);
      return url;
    }
    return null;
  };
  useEffect(() => {
    form.resetFields();
  }, [formData]);
  useEffect(() => {
    const callApi = async () => {
      try {
        setAvatarLoading(true);
        //prettier-ignore
        if (userStorage?.username) {
          const userData = (await userService.getUserByUsername(userStorage?.username))?.data;
          const listRank = (await rankService.getAll())?.data;
          const avatarFileInfor = (await avatarService.getAvatarFileOfCurrentUser())?.data;
          
          let resourceResponse;
          if(avatarFileInfor){
             resourceResponse = await fileService.download(FILE_TYPE.avatar,avatarFileInfor.code,{
             responseType: 'blob',
            });
          }
          
          dispatch({
            type: 'FETCH',
            payload:{
              user:userData,
              avatarResourceResponse: resourceResponse,
              data:{
                [formFieldName.fullname]: userData?.name,
                [formFieldName.username]:  userData?.username,
                [formFieldName.organ]: userData.organ?.name,
                [formFieldName.rank]: userData.rank ? JSON.stringify(userData.rank) : null,
              },
              option:{
                [formFieldName.rank]: generateRankOption(listRank),
              }
            }
          });
          setAvatarLoading(false);
        }
      } catch (error) {
        console.log(error);
        message.error('Có lỗi xảy ra');
      }
    };
    callApi();
  }, [refresh]);
  const uploadProps = {
    accept: 'image/*', // hiện danh sách loại file khi người dùng mở bảng upload file
    customRequest: uploadAvatar,
    showUploadList: false, // không hiển thị list file uploaded
    beforeUpload: (file) => {
      //check file type upload
      if (!Object.values(AVATAR_MIME_TYPE).includes(file.type)) {
        message.error('Không hỗ trợ loại file này');
        return Upload.LIST_IGNORE;
      } else if (file.size > MAX_AVATAR_SIZE) {
        //check file zie
        message.error(
          `Không thể upload ảnh lớn hơn ${Math.round(MAX_AVATAR_SIZE / 1000)}KB`
        );
        return Upload.LIST_IGNORE; // không chấp nhận file
      }
      return true; // return false thì dừng upload
    },
    multiple: false, // k chọn nhiều file cùng lúc bằng phím ctl
    maxCount: 1, // giới hạn tệp upload,cái sau thay thế cái trước nếu = 1
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
        initialValues={formData.data}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        style={{
          marginTop: 30,
        }}
      >
        <Form.Item noStyle>
          <Row>
            <Col
              span={4}
              offset={1}
              style={{
                textAlign: 'right',
              }}
            >
              <Avatar
                style={{ border: '1px solid #d9d9d9' }}
                size={60}
                src={
                  <Image
                    src={
                      getAvatarFromResourceResponse(
                        formData.avatarResourceResponse
                      ) ?? defaultAvatar
                    }
                  />
                }
              />
            </Col>
            <Col span={8} offset={1}>
              <Spin spinning={avatarLoading}>
                <Title
                  level={5}
                  style={{
                    marginBottom: 7,
                  }}
                >
                  {userStorage?.username}
                </Title>
                <Upload {...uploadProps}>
                  <Button
                    style={{
                      padding: 0,
                      marginBottom: 7,
                    }}
                    type="link"
                  >
                    Cập nhật ảnh đại diện
                  </Button>
                </Upload>
                <br />
                {formData.avatarResourceResponse ? (
                  <Popconfirm
                    placement="right"
                    title="Xóa ảnh đại diện ?"
                    onConfirm={handleDeleteAvatar}
                    okText="Có"
                    cancelText="Không"
                    icon={<WarningOutlined />}
                  >
                    <Button
                      style={{
                        padding: 0,
                      }}
                      type="link"
                    >
                      Xóa ảnh đại diện
                    </Button>
                  </Popconfirm>
                ) : null}
              </Spin>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item
          style={{ marginTop: 24 }}
          label="Họ tên"
          name={formFieldName.fullname}
          rules={[
            {
              required: true,
              message: MESSAGE_REQUIRE,
            },
          ]}
        >
          <Input spellCheck={false} />
        </Form.Item>
        <Form.Item label="Tên tài khoản" name={formFieldName.username}>
          <Input style={{ ...disableInput }} readOnly />
        </Form.Item>
        <Form.Item label="Cơ quan trực thuộc" name={formFieldName.organ}>
          <TextArea
            style={{ ...disableInput }}
            readOnly
            autoSize={{
              minRows: 1,
              maxRows: 2,
            }}
            spellCheck={false}
          />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          // name={formFieldName.address}
        >
          <TextArea
            autoSize={{
              minRows: 1,
              maxRows: 2,
            }}
            spellCheck={false}
            defaultValue={'18 Thanh Thủy Hai Bà Trưng Phú Thọ'}
          />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          // name={formFieldName.sdt}
        >
          <Input defaultValue={'03368266478'} />
        </Form.Item>
        <Form.Item
          label="Email"
          // name={formFieldName.email}
          // rules={[
          //   {
          //     type: 'email',
          //     message: 'Email không hợp lệ',
          //   },
          // ]}
        >
          <Input defaultValue={'userinfor@qldt.com'} />
        </Form.Item>
        <Form.Item label="Chức danh" name={formFieldName.rank}>
          <Select
            placeholder="Chọn chức danh"
            allowClear
            showSearch
            // optionFilterProp="label"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={formData.option[formFieldName.rank]}
          />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 6,
            span: 8,
          }}
        >
          <Space>
            <Button type="primary" htmlType="submit" disabled={disableResetBtn}>
              <EditOutlined />
              Lưu
            </Button>
            <Button
              type="primary"
              onClick={handleResetForm}
              danger
              disabled={disableResetBtn}
            >
              <CloseCircleOutlined />
              Hủy
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
}

export default Profile;
