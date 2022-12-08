import { ClearOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Select, Space, Upload } from 'antd';
import {
  antdIconFontSize,
  MAX_FILE_SIZE,
  MESSAGE_REQUIRE,
  MIME_TYPE,
} from 'configs/general';
import { useEffect, useMemo, useState, memo } from 'react';
import * as countService from 'services/CountService';
import * as uploadService from 'services/UploadFileService';
import { getFileList } from 'utils/fileUtil';
import { optionSelectFillOBJ } from 'utils/formUtil';
import { openNotificationWithIcon } from 'utils/general';
function FormUpload(props) {
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [disableResetBtn, setDisableResetBtn] = useState(true);
  const [formTypes, setFormTypes] = useState([]);
  const formFieldNames = {
    name: 'tenbieumau',
    type: 'loaibieumau',
    file: 'tepdinhkem',
  };
  const onFinish = async (values) => {
    const numberFormExist = (
      await countService
        .countFormByName(values[formFieldNames.name])
        .catch((err) => {
          console.log(err);
          openNotificationWithIcon('error', null, 'top');
        })
    )?.data;

    if (!numberFormExist) {
      const createdForm = (
        await uploadService
          .createForm({
            name: values[formFieldNames.name],
            type: JSON.parse(values[formFieldNames.type]),
          })
          .catch((err) => {
            console.log(err);
            openNotificationWithIcon('error', null, 'top');
          })
      )?.data;

      if (createdForm) {
        const formData = new FormData();
        //upload 1 file,viết foreach có thể handle nhiều file
        values[formFieldNames.file].forEach((file, index) => {
          formData.append('fileUpload', file.originFileObj); // có thể k cần originFileObj
        });
        formData.append('formId', createdForm.id);
        uploadService
          .uploadFormFile(formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(() => {
            handleResetForm();
            openNotificationWithIcon('success', 'Tạo biểu mẫu', 'top');
            props?.onRefresh();
          })
          .catch((err) => {
            //delete form in db
            uploadService.deleteForm(createdForm.id).catch(() => {});
            console.log(err);
            openNotificationWithIcon('error', null, 'top');
          });
      }
    } else
      openNotificationWithIcon('error', null, 'top', 'Biểu mẫu đã tồn tại');
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
  useEffect(() => {
    console.log('formupload render');
  });
  useEffect(() => {
    console.log('formupload call api');
    uploadService
      .getAllFormType()
      .then((response) => {
        setFormTypes(response.data);
      })
      .catch((err) => {
        console.log(err);
        openNotificationWithIcon('error', null, 'top');
      });
  }, []);

  //dùng memo tránh call nhiều lần
  const optionsFormTypes = useMemo(() => {
    return optionSelectFillOBJ(formTypes);
  }, [formTypes]);

  const getFormTypeSelectProps = (optionsData) => ({
    allowClear: true,
    options: optionsFormTypes,
  });
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
          label="Loại biểu mẫu"
          name={formFieldNames.type}
          rules={[
            {
              required: true,
              message: MESSAGE_REQUIRE,
            },
          ]}
        >
          <Select
            {...getFormTypeSelectProps(formTypes)}
            // onChange={onStatusChange}
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
              <ClearOutlined
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

export default memo(FormUpload);
