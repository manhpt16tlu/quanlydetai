import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Input, Row, Space, Table } from 'antd';
import { routes as routesConfig } from 'configs/general';
import React, { useEffect, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import * as organService from 'services/OrganService';
import * as topicService from 'services/TopicService';
import { openNotificationWithIcon } from 'utils/general';
import {
  INITIAL_PAGE_STATE,
  pageReducer,
  generateDateString,
} from 'utils/topicUtil';
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
  const [dataPaging, dispatch] = useReducer(pageReducer, INITIAL_PAGE_STATE);
  useEffect(() => {
    console.log('call api');
    setLoading(true);
    topicService
      .getFilteredApproved(
        filteredInfo[dataIndexTable.name]?.[0],
        filteredInfo[dataIndexTable.organ]?.[0],
        filteredInfo[dataIndexTable.manager]?.[0],
        dataPaging.current - 1,
        dataPaging.pageSize
      )
      .then((data) => {
        setTableData(generateTableData(data.data.content));
        dispatch({
          type: 'FETCH',
          totalElements: data.data.totalElements,
          pageSize: data.data.size,
        });
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
        //finish loading in last then function
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        openNotificationWithIcon('error', null, 'top');
      });
  }, [dataPaging.current, filteredInfo]);
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
            }}
            style={{
              marginBottom: 8,
              display: 'block',
            }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => {
                confirm();
              }}
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
    },
    {
      title: 'Chủ nhiệm',
      dataIndex: dataIndexTable.manager,
      filteredValue: filteredInfo[dataIndexTable.manager] || null,
      ...getColumnSearchProps(dataIndexTable.manager, 'tên chủ nhiệm'),
      width: '20%',
    },
    {
      title: 'Thời gian thực hiện',
      dataIndex: dataIndexTable.time,
      align: 'center',
    },
  ];
  const handleTableChange = (pagination, filters, sorter) => {
    console.log('filters data : ', filters);
    //control filter reset
    setFilteredInfo(filters);
  };
  const paginationProps = () => {
    return {
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
  };
  return (
    <div>
      <Row justify="end">
        <Col>
          <Button
            onClick={() => {
              if (Object.keys(filteredInfo).length !== 0) setFilteredInfo({});
            }}
            type="primary"
          >
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
        pagination={paginationProps()}
        columns={columns}
        dataSource={tableData}
        loading={loading}
        onChange={handleTableChange}
      />
    </div>
  );
}

export default TopicList;
