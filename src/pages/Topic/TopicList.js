import { Divider, Radio, Table, Input, Space, Button, Row, Col } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as topicService from 'services/TopicService';
import * as organService from 'services/OrganService';
import { routes as routesConfig } from 'configs/general';
import { openNotificationWithIcon } from 'utils/general';
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
  const [loading, setLoading] = useState(false);
  const [dataFilterOrgan, setDataFilterOrgan] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState({});
  useEffect(() => {
    console.log('call api');
    setLoading(true);
    topicService
      .getApproved()
      .then((data) => {
        setTableData(generateTableData(data.data));
        setLoading(false);
      })
      .then(() => {
        //process data filter organ
        return organService.getAllNoPaging();
      })
      .then((data) => {
        const organFilter = data.data.map((organ, i) => {
          return { text: organ.name, value: organ.name };
        });
        setDataFilterOrgan(organFilter);
      })
      .catch((err) => {
        console.log(err);
        openNotificationWithIcon('error', null, 'top');
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
      filteredValue: filteredInfo[dataIndexTable.name] || null,
      ...getColumnSearchProps(dataIndexTable.name, 'tên đề tài'),
    },
    {
      title: 'Cơ quan chủ trì',
      dataIndex: dataIndexTable.organ,
      filters: dataFilterOrgan,
      filteredValue: filteredInfo[dataIndexTable.organ] || null,
      onFilter: (value, record) => {
        return record[dataIndexTable.organ].startsWith(value);
      },
      filterSearch: true,
      filterIcon: (filtered) => (
        <FilterOutlined
          style={{
            color: filtered ? '#1890ff' : undefined,
            fontSize: 18,
          }}
        />
      ),
      width: '20%',
      // ellipsis: true,
    },
    {
      title: 'Chủ nhiệm',
      dataIndex: dataIndexTable.manager,
      filteredValue: filteredInfo[dataIndexTable.manager] || null,
      ...getColumnSearchProps(dataIndexTable.manager, 'tên chủ nhiệm'),
    },
    {
      title: 'Thời gian thực hiện',
      dataIndex: dataIndexTable.time,
      align: 'center',
    },
  ];
  const handleTableChange = (pagination, filters, sorter) => {
    //control filter reset
    setFilteredInfo(filters);
  };
  return (
    <div>
      <Row justify="end">
        <Col>
          <Button onClick={() => setFilteredInfo({})} type="primary">
            Clear all filter
          </Button>
        </Col>
      </Row>
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
        loading={loading}
        onChange={handleTableChange}
      />
    </div>
  );
}

export default TopicList;
