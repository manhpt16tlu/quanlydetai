import { Button, Space, Checkbox, Form, Input, Upload, message } from 'antd';
import {
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  MESSAGE_REQUIRE,
  antdIconFontSize,
  MAX_FILE_SIZE,
  MIME_TYPE,
} from 'configs/general';
import { openNotificationWithIcon } from 'utils/general';
import { getFileList } from 'utils/fileUtil';
import { useState } from 'react';
function FormUpload() {
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [disableResetBtn, setDisableResetBtn] = useState(true);
  const formFieldNames = {
    title: 'tenbieumau',
    file: 'tepdinhkem',
  };
  const onFinish = async (values) => {};
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const handleResetForm = () => {
    form.resetFields();
    setDisableResetBtn(true);
  };
  const handleFormValuesChange = (changedValues, allValues) => {
    console.log(allValues);
    setDisableResetBtn(false);
  };
  const uploadProps = {
    beforeUpload: (file) => {
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
          label="Tên biểu mẫu"
          name={formFieldNames.title}
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
          getValueFromEvent={getFileList} // vì onchange upload return object
          valuePropName="fileList" // prop của child component chứa value
          name={formFieldNames.file}
          label="File đính kèm"
          rules={[
            {
              required: true,
              message: MESSAGE_REQUIRE,
            },
          ]}
        >
          <Upload {...uploadProps}>
            <Button
              size="middle"
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
            offset: 3,
            span: 10,
          }}
          style={{
            marginTop: 50,
          }}
        >
          <Space size="large">
            <Button
              type="primary"
              onClick={handleResetForm}
              disabled={disableResetBtn}
            >
              <DeleteOutlined
                style={{
                  fontSize: antdIconFontSize,
                }}
              />
              Đặt lại
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

export default FormUpload;
