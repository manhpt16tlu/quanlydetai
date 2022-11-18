import { Divider, Radio, Table, Input, Space, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
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
    topicService.getApproved().then((data) => {
      setTableData(generateTableData(data.data));
    });
  }, []);

  const getColumnSearchProps = (dataIndex, inputPlaceHolder) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => {
      return (
        <div
          style={{
            padding: 8,
          }}
        >
          <Input
            placeholder={`Nhập ${inputPlaceHolder}`}
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
              confirm({
                closeDropdown: false,
              });
            }}
            style={{
              marginBottom: 8,
              display: 'block',
            }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{
                width: 90,
              }}
            >
              Search
            </Button>
            <Button
              onClick={() => {
                clearFilters();
                confirm();
              }}
              size="small"
              style={{
                width: 90,
              }}
            >
              Reset
            </Button>
          </Space>
        </div>
      );
    },
    onFilter: (value, record) => {
      return record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    },
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
          fontSize: 18,
        }}
      />
    ),
  });

  const columns = [
    {
      title: 'Tên đề tài',
      dataIndex: dataIndexTable.name,
      width: '40%',
      render: (text, record) => (
        <Link
          to={routesConfig.topicDetail}
          state={{ [btoa('topicId')]: btoa(record[dataIndexTable.id]) }}
        >
          {text}
        </Link>
      ),
      ...getColumnSearchProps(dataIndexTable.name, 'tên đề tài'),
    },
    {
      title: 'Cơ quan chủ trì',
      dataIndex: dataIndexTable.organ,
    },
    {
      title: 'Chủ nhiệm',
      dataIndex: dataIndexTable.manager,
      ...getColumnSearchProps(dataIndexTable.manager, 'tên chủ nhiệm'),
    },
    {
      title: 'Thời gian thực hiện',
      dataIndex: dataIndexTable.time,
      align: 'center',
    },
  ];
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
