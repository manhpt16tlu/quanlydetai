import { Divider, Radio, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as topicService from 'services/TopicService';
import { routes as routesConfig } from 'configs/general';
const dataIndexTable = {
  id: 'id',
  uid: 'uid',
  name: 'tendetai',
  organ: 'coquanchutri',
  manager: 'chunhiem',
  time: 'thoigianthuchien',
};
const columns = [
  {
    title: 'Tên đề tài',
    dataIndex: dataIndexTable.name,
    width: '40%',
    render: (text, record) => (
      <Link
        to={routesConfig.topicDetail}
        state={{ topicID: record[dataIndexTable.id] }}
      >
        {text}
      </Link>
    ),
  },
  {
    title: 'Cơ quan chủ trì',
    dataIndex: dataIndexTable.organ,
  },
  {
    title: 'Chủ nhiệm',
    dataIndex: dataIndexTable.manager,
  },
  {
    title: 'Thời gian thực hiện',
    dataIndex: dataIndexTable.time,
    align: 'center',
  },
];
const rowSelection = {
  type: 'checkbox',
  onChange: (selectedRowKeys, selectedRows) => {},
  getCheckboxProps: (record) => {
    return {};
  },
};
const generateDateString = (startDate, endDate) => {
  const s = new Date(startDate);
  const e = new Date(endDate);
  return s.getMonth() == e.getMonth() && s.getFullYear() == e.getFullYear()
    ? `${s.getMonth() + 1}/${s.getFullYear()}`
    : `${s.getMonth() + 1}/${s.getFullYear()} - ${
        e.getMonth() + 1
      }/${e.getFullYear()}`;
};
const generateTableData = (data) => {
  return data.map((topic, index) => ({
    key: index,
    [dataIndexTable.id]: topic.id,
    [dataIndexTable.name]: topic.name,
    [dataIndexTable.organ]: topic.organ.name,
    [dataIndexTable.manager]: topic.manager,
    [dataIndexTable.time]: generateDateString(topic.startDate, topic.endDate),
  }));
};
function TopicList() {
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    console.log('call api');
    topicService.getAll().then((data) => {
      setTableData(generateTableData(data.data));
    });
  }, []);
  return (
    <div>
      <Divider />
      <Table
        bordered
        rowSelection={{
          ...rowSelection,
        }}
        pagination={{
          defaultCurrent: 1,
          defaultPageSize: 7,
        }}
        columns={columns}
        dataSource={tableData}
      />
    </div>
  );
}

export default TopicList;
