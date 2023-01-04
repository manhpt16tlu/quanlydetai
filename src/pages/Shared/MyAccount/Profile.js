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
} from 'antd';
import { MESSAGE_REQUIRE } from 'configs/general';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
} from '@ant-design/icons';
import produce from 'immer';
import { useEffect, useReducer, useState } from 'react';
import avatar from 'assets/images/default_avatar.jpg';
import * as userService from 'services/UserService';
import * as rankService from 'services/UserRankService';
import * as authService from 'services/AuthService';
import { openNotificationWithIcon } from 'utils/general';
// import { optionSelectFillOBJ } from 'utils/topicUtil';
import isEqual from 'lodash/isEqual';

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
  const [form] = Form.useForm();
  const [formData, dispatch] = useReducer(reducer, initFormData);
  const [disableResetBtn, setDisableResetBtn] = useState(true);
  const [refresh, setRefresh] = useState(false);
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
  const handleFormValuesChange = (changedValues, allValues) => {
    setDisableResetBtn(false);
  };
  const handleResetForm = () => {
    form.resetFields();
    setDisableResetBtn(true);
  };
  const handleAvatarChange = async () => {};
  useEffect(() => {
    form.resetFields();
  }, [formData]);
  useEffect(() => {
    const callApi = async () => {
      try {
        //prettier-ignore
        if (userStorage?.username) {
          const userData = (await userService.getUserByUsername(userStorage?.username))?.data;
          const listRank = (await rankService.getAll())?.data;
          
          dispatch({
            type: 'FETCH',
            payload:{
              user:userData,
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
        }
      } catch (error) {
        console.log(error);
        message.error('Có lỗi xảy ra');
      }
    };
    callApi();
  }, [refresh]);
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
              <Avatar size={60} src={<Image src={avatar} />} />
            </Col>
            <Col span={8} offset={1}>
              <Title
                level={5}
                style={{
                  marginBottom: 0,
                }}
              >
                {userStorage?.username}
              </Title>
              <Upload>
                <Button
                  onClick={handleAvatarChange}
                  style={{
                    padding: 0,
                  }}
                  type="link"
                >
                  Thay đổi ảnh đại diện
                </Button>
              </Upload>
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
