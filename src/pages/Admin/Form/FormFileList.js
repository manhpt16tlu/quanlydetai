import {
  DeleteOutlined,
  DownloadOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import {
  Divider,
  Space,
  Table,
  Button,
  Popconfirm,
  Spin,
  message,
  Breadcrumb,
} from 'antd';
import moment from 'moment';
import {
  useEffect,
  useState,
  useReducer,
  useCallback,
  useContext,
} from 'react';
import { Link } from 'react-router-dom';
import * as uploadSerivce from 'services/UploadFileService';
import * as formService from 'services/FormService';
import FormUpload from 'components/Form/FormUpload';
import { INITIAL_PAGE_STATE, pageReducer } from 'utils/general';
import {
  openNotificationWithIcon,
  getFileNameFromHeaderDisposition,
} from 'utils/general';
import {
  antdIconFontSize,
  ROLES,
  TIMESTAMP_FORMAT,
  routes as routesConfig,
} from 'configs/general';
import { AntdSettingContext } from 'context/AntdSettingContext';
function FormFileList() {
  const { tableStyle } = useContext(AntdSettingContext);
  const [tableBorder] = tableStyle;
  const [loading, setLoading] = useState(false);
  const [dataPaging, dispatch] = useReducer(pageReducer, INITIAL_PAGE_STATE);
  const [refresh, setRefresh] = useState(false);
  const dataIndexTable = {
    id: 'ma',
    name: 'tenbieumau',
    type: 'loai',
    date: 'ngaybanhanh',
  };
  const handleRefresh = useCallback(() => {
    setRefresh((prev) => !prev);
  }, []);
  const generateTableData = (forms) => {
    return forms.map((form, index) => ({
      key: index,
      [dataIndexTable.name]: form.name,
      [dataIndexTable.date]: moment(form.createDate).format(TIMESTAMP_FORMAT),
      [dataIndexTable.type]: form.type.title,
      [dataIndexTable.id]: form.id,
    }));
  };
  const handleDownloadForm = async (formId) => {
    const form = (await formService.getFormById(formId).catch((err) => {}))
      ?.data;
    const formFile = (
      await formService.getFormFileByFormId(form?.id).catch((err) => {})
    )?.data;
    if (form && formFile) {
      uploadSerivce
        .download('form', formFile.code, {
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
    } else message.error('File không tồn tại');
  };
  const confirmDeleteForm = (formId) => {
    uploadSerivce
      .deleteForm(formId)
      .then(() => {
        openNotificationWithIcon('success', 'Xóa biểu mẫu', 'top');
        handleRefresh();
      })
      .catch((err) => {
        console.log(err);
        openNotificationWithIcon('error', 'Xóa biểu mẫu', 'top');
      });
  };
  const cancelDelete = (e) => {};
  const tableColumn = [
    {
      title: 'Tên biểu mẫu',
      dataIndex: dataIndexTable.name,
      width: '45%',
      render: (text, record) => <Link>{text}</Link>,
    },
    {
      title: 'Loại',
      width: '17%',
      dataIndex: dataIndexTable.type,
    },
    {
      title: 'Ngày ban hành',
      dataIndex: dataIndexTable.date,
      width: '20%',
    },
    {
      title: 'Hành động',
      align: 'center',
      render: (_, record) => {
        return (
          <>
            <Space size={10}>
              <Popconfirm
                placement="topLeft"
                title="Bạn chắc chắn muốn xóa biểu mẫu này ?"
                onConfirm={() => confirmDeleteForm(record[dataIndexTable.id])}
                onCancel={cancelDelete}
                okText="Có"
                cancelText="Không"
                icon={<WarningOutlined />}
              >
                <Button type="primary" danger>
                  <DeleteOutlined
                    style={{
                      fontSize: antdIconFontSize,
                    }}
                  />
                  Xóa
                </Button>
              </Popconfirm>
              <Button
                type="primary"
                onClick={() => handleDownloadForm(record[dataIndexTable.id])}
              >
                <DownloadOutlined
                  style={{
                    fontSize: antdIconFontSize,
                  }}
                />
                Tải xuống
              </Button>
            </Space>
          </>
        );
      },
    },
  ];
  const handleTableChange = (pagination, filters, sorter) => {
    console.log();
  };
  const paginationProps = {
    current: dataPaging.current,
    pageSize: dataPaging.pageSize,
    total: dataPaging.totalElements,
    onChange: (page, pageSize) => {
      dispatch({
        type: 'PAGE_CHANGE',
        current: page,
        pageSize: pageSize,
      });
    },
  };
  const rowSelection = {
    type: 'checkbox',
    onChange: (selectedRowKeys, selectedRows) => {},
  };
  useEffect(() => {
    console.log('formfilelist render');
  });
  useEffect(() => {
    console.log('formlist call api');
    const callApi = async () => {
      setLoading(true);
      const pageResponse = (
        await uploadSerivce.getAllForm(
          dataPaging.current - 1,
          dataPaging.pageSize
        )
      )?.data;
      dispatch({
        type: 'FETCH',
        totalElements: pageResponse.totalElements,
        pageSize: pageResponse.size,
        tableData: generateTableData(pageResponse?.content ?? []),
      });
      setLoading(false);
    };
    callApi();
  }, [dataPaging.current, refresh]);
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to={routesConfig[ROLES.admin].home}>Trang chủ</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Biểu mẫu</Breadcrumb.Item>
      </Breadcrumb>
      <Divider
        style={{
          marginTop: 30,
        }}
        orientation="left"
      >
        Tạo mới
      </Divider>
      <FormUpload onRefresh={handleRefresh} />
      <Divider orientation="left">Danh sách biểu mẫu</Divider>
      <Spin spinning={loading}>
        <Table
          bordered={tableBorder}
          rowSelection={rowSelection}
          columns={tableColumn}
          dataSource={dataPaging?.tableData}
          pagination={paginationProps}
        />
      </Spin>
    </>
  );
}

export default FormFileList;
