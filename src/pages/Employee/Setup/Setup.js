import { CheckCircleOutlined, ClearOutlined } from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  Col,
  Form,
  Radio,
  Row,
  Space,
  Tooltip,
  Typography,
} from 'antd';
import {
  antdIconFontSize,
  LOCALSTORAGE_KEY,
  ROLES,
  routes as routesConfig,
} from 'configs/general';
import {
  AntdSettingContext,
  COMPONENT_SIZE,
  TABLE_TYPE_BORDER,
} from 'context/AntdSettingContext';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { capitalizeFirstLetter, openNotificationWithIcon } from 'utils/general';
const { Text } = Typography;
const formFieldName = {
  componentSize: 'componentSize',
  tableStyle: 'tableStyle',
};
// const reducer = (state, action) => {
//   switch (action.type) {
//     case 'CHANGE_COMPONENT_SIZE':
//       return produce(state, (draft) => {
//         draft.initFormData[formFieldName.componentSize] = action.payload;
//       });
//     default:
//       return state;
//   }
// };
function Setup() {
  const [form] = Form.useForm();
  const [disableResetBtn, setDisableResetBtn] = useState(true);
  const { componentSize, tableStyle } = useContext(AntdSettingContext);
  const [size, setSize] = componentSize;

  const [tableBorder, setTableBorder] = tableStyle;
  const initFormData = {
    [formFieldName.componentSize]: size,
    [formFieldName.tableStyle]: tableBorder,
  };

  const handleResetForm = () => {
    form.resetFields();
    setDisableResetBtn(true);
  };
  const onFinish = async (values) => {
    const newComponentSize = values[formFieldName.componentSize];
    const newTableStyle = values[formFieldName.tableStyle];
    let change = false;
    if (newComponentSize !== initFormData[formFieldName.componentSize]) {
      change = true;
      localStorage.setItem(LOCALSTORAGE_KEY.componentSize, newComponentSize);
      setSize(newComponentSize);
    }
    if (newTableStyle !== initFormData[formFieldName.tableStyle]) {
      change = true;
      localStorage.setItem(LOCALSTORAGE_KEY.tableStyle, newTableStyle);
      setTableBorder(newTableStyle);
    }
    if (change) openNotificationWithIcon('success', 'Thiết lập', 'top');
    handleResetForm();
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const handleFormValuesChange = (changedValues, allValues) => {
    // console.log(allValues);
    setDisableResetBtn(false);
  };
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to={routesConfig[ROLES.admin].home}>Trang chủ</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Thiết lập</Breadcrumb.Item>
      </Breadcrumb>
      <Form
        layout="vertical"
        form={form}
        initialValues={initFormData}
        onValuesChange={handleFormValuesChange}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        style={{ marginTop: 30 }}
      >
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              label={
                <Tooltip title="Thay đổi kích thước các thành phần">
                  <Text strong>Component size</Text>
                </Tooltip>
              }
              name={formFieldName.componentSize}
            >
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value={COMPONENT_SIZE.large}>
                    {capitalizeFirstLetter(COMPONENT_SIZE.large)}
                  </Radio>
                  <Radio value={COMPONENT_SIZE.middle}>
                    {capitalizeFirstLetter(COMPONENT_SIZE.middle)}
                  </Radio>
                  <Radio value={COMPONENT_SIZE.small}>
                    {capitalizeFirstLetter(COMPONENT_SIZE.small)}
                  </Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={
                <Tooltip title="Thay đổi loại bảng dữ liệu">
                  <Text strong>Table style</Text>
                </Tooltip>
              }
              name={formFieldName.tableStyle}
            >
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value={TABLE_TYPE_BORDER.border}>Border</Radio>
                  <Radio value={TABLE_TYPE_BORDER.noBorder}>No border</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={6}></Col>
          <Col span={6}></Col>
        </Row>
        <Form.Item
          style={{
            marginTop: 50,
          }}
        >
          <Space size="small">
            <Button type="primary" htmlType="submit">
              <CheckCircleOutlined
                style={{
                  fontSize: antdIconFontSize,
                }}
              />
              Lưu thay đổi
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

export default Setup;
