import { useEffect, useState } from 'react';
import { Table } from 'antd';
import { Link } from 'react-router-dom';
import * as topicService from 'services/TopicService';
import { openNotificationWithIcon } from 'utils/general';
// component for panel collapse
function TableDataPanel(props) {
  console.log('table data panel render');
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const dataIndexTable = {
    id: 'id',
    name: 'tendetai',
    organ: 'coquanchutri',
    manager: 'chunhiem',
    time: 'thoigianthuchien',
    field: 'linhvuc',
  };
  const columns = [
    {
      title: 'Tên đề tài',
      dataIndex: dataIndexTable.name,
      render: (text, record) => <Link>{text}</Link>,
    },
    {
      title: 'Lĩnh vực',
      dataIndex: dataIndexTable.field,
    },
    {
      title: 'Chủ nhiệm',
      dataIndex: dataIndexTable.manager,
    },
    {
      title: 'Thời gian thực hiện',
      dataIndex: dataIndexTable.time,
    },
  ];
  const rowSelection = {
    type: 'checkbox',
    onChange: (selectedRowKeys, selectedRows) => {},
    getCheckboxProps: (record) => ({}),
  };
  const generateTableData = (data) => {
    console.log(data);
  };
  useEffect(() => {
    setLoading(true);
    const getData = async () => {
      try {
        console.log('call api');
        const response = await topicService.getNonApprovedByOrganId(
          props.organId
        );
        setTableData(generateTableData(response.data));
        setLoading(false);
      } catch (error) {
        console.log(error);
        openNotificationWithIcon('error', null, 'top');
      }
    };
    getData();
  }, []);
  return (
    <>
      <Table
        loading={loading}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={tableData}
      />
    </>
  );
}

export default TableDataPanel;
