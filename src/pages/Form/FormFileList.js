import { Divider, Table, Button } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as fileService from 'services/UploadFileService';
import FormUpload from 'components/Form/FormUpload';

function FormFileList() {
  const [tableData, setTableData] = useState([]);
  const generateTableData = (files) => {
    return files.map((file, index) => ({
      key: index,
      [dataIndexTable.fileCode]: file.fileCode,
      [dataIndexTable.createDate]: file.createDate,
      [dataIndexTable.originName]: file.originName,
      [dataIndexTable.title]: file.title,
    }));
  };
  const dataIndexTable = {
    fileCode: 'ma',
    originName: 'tenbandau',
    serverName: 'tenmoi',
    size: 'kichthuoc',
    createDate: 'ngaytao',
    title: 'tieude',
  };
  const tableColumn = [
    {
      title: 'Tên biểu mẫu',
      dataIndex: dataIndexTable.title,
      width: '60%',
      render: (text, record) => <Link>{text}</Link>,
    },
    {
      title: 'Ngày ban hành',
      dataIndex: dataIndexTable.title,
    },
  ];
  const handleTableChange = (pagination, filters, sorter) => {
    console.log();
  };

  const paginationProps = {};
  const rowSelection = {
    type: 'checkbox',
    onChange: (selectedRowKeys, selectedRows) => {},
  };
  useEffect(() => {
    console.log('formfilelist render');
  });
  useEffect(() => {
    const callApi = async () => {
      const response = await fileService.getFilesByType('Biểu mẫu');
      setTableData(generateTableData(response.data));
    };
    callApi();
  }, []);
  return (
    <>
      <Divider orientation="left">Tạo mới</Divider>
      <FormUpload />
      <Divider orientation="left">Danh sách biểu mẫu</Divider>
      <Table
        rowSelection={rowSelection}
        columns={tableColumn}
        dataSource={tableData}
        pagination={paginationProps}
      />
    </>
  );
}

export default FormFileList;
