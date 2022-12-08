import { DeleteOutlined, WarningOutlined } from '@ant-design/icons';
import { Divider, Table, Button, Popconfirm, Spin } from 'antd';
import moment from 'moment';
import { useEffect, useState, useReducer, useCallback } from 'react';
import { Link } from 'react-router-dom';
import * as uploadSerivce from 'services/UploadFileService';
import FormUpload from 'components/Form/FormUpload';
import { INITIAL_PAGE_STATE, pageReducer } from 'utils/formUtil';
import { openNotificationWithIcon } from 'utils/general';
import { antdIconFontSize, TIMESTAMP_FORMAT } from 'configs/general';
function FormFileList() {
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
  const handleDownloadForm = (formId) => {
    console.log(formId);
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
      render: (text, record) => (
        <Link onClick={() => handleDownloadForm(record[dataIndexTable.id])}>
          {text}
        </Link>
      ),
    },
    {
      title: 'Loại',
      width: '17%',
      dataIndex: dataIndexTable.type,
    },
    {
      title: 'Ngày ban hành',
      dataIndex: dataIndexTable.date,
    },
    {
      render: (_, record) => {
        return (
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
      <Divider orientation="left">Tạo mới</Divider>
      <FormUpload onRefresh={handleRefresh} />
      <Divider orientation="left">Danh sách biểu mẫu</Divider>
      <Spin spinning={loading}>
        <Table
          bordered
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
