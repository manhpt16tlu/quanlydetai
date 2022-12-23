import { ClearOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Select, Space, Upload } from 'antd';
import {
  antdIconFontSize,
  MAX_FILE_SIZE,
  MESSAGE_REQUIRE,
  MIME_TYPE,
} from 'configs/general';
import { useEffect, useMemo, useState, memo } from 'react';
import * as uploadService from 'services/UploadFileService';
import * as formService from 'services/FormService';
import * as organService from 'services/OrganService';
import { getFileList } from 'utils/fileUtil';
import { optionSelectFillOBJ } from 'utils/formUtil';
import { openNotificationWithIcon } from 'utils/general';
const formFieldNames = {
  name: 'tencoquan',
  address: 'diachi',
  email: 'email',
};
const { TextArea } = Input;
function OrganCreate({ onRefresh }) {
  const [form] = Form.useForm();
  const [disableResetBtn, setDisableResetBtn] = useState(true);
  const onFinish = async (values) => {
    try {
      const existByName = (
        await organService.existByName(values[formFieldNames.name])
      )?.data;

      if (!existByName) {
        const organCreated = (
          await organService.create({
            name: values[formFieldNames.name],
            address: values[formFieldNames.address],
            email: values[formFieldNames.email],
          })
        )?.data;
        if (organCreated) {
          openNotificationWithIcon('success', 'Thêm cơ quan', 'top');
          handleResetForm();
          onRefresh();
        }
      } else {
        openNotificationWithIcon('error', null, 'top', 'Cơ quan đã tồn tại');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleResetForm = () => {
    form.resetFields();
    setDisableResetBtn(true);
  };
  const handleFormValuesChange = (changedValues, allValues) => {
    // console.log(allValues);
    setDisableResetBtn(false);
  };

  return (
    <>
      <Form
        form={form}
        name="basic"
        labelCol={{
          span: 3,
        }}
        wrapperCol={{
          span: 10,
        }}
        initialValues={{}}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        onValuesChange={handleFormValuesChange}
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
          label="Email"
          name={formFieldNames.email}
          rules={[
            {
              type: 'email',
              message: 'Email không hợp lệ',
            },
            {
              required: true,
              message: MESSAGE_REQUIRE,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 3,
            span: 10,
          }}
          style={{
            marginTop: 40,
          }}
        >
          <Space size="large">
            <Button
              type="primary"
              onClick={handleResetForm}
              disabled={disableResetBtn}
              danger
            >
              <ClearOutlined
                style={{
                  fontSize: antdIconFontSize,
                }}
              />
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              <PlusOutlined
                style={{
                  fontSize: antdIconFontSize,
                }}
              />
              Tạo mới
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
}

export default memo(OrganCreate);
