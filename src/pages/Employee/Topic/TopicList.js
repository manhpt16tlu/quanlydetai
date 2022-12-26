import {
  ClearOutlined,
  FilterOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Col, Input, Row, Space, Table, Breadcrumb } from 'antd';
import CustomDivider from 'components/General/CustomDivider';
import {
  antdIconFontSize,
  ROLES,
  routes as routesConfig,
} from 'configs/general';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as authService from 'services/AuthService';
import * as topicService from 'services/TopicService';
import * as statusService from 'services/TopicStatusService';
import * as fieldService from 'services/TopicFieldService';
import { openNotificationWithIcon } from 'utils/general';
import { generateDateString } from 'utils/topicUtil';
import { INITIAL_PAGE_STATE, pageReducer } from 'utils/general';
import { AntdSettingContext } from 'context/AntdSettingContext';
const dataIndexTable = {
  id: 'id',
  name: 'tendetai',
  time: 'thoigianthuchien',
  status: 'trangthai',
  field: 'linhvuc',
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
    [dataIndexTable.status]: topic.topicStatus.title,
    [dataIndexTable.field]: topic.topicField.title,
    [dataIndexTable.time]: generateDateString(topic.startDate, topic.endDate),
  }));
};
const convertFilterToParams = (filterData) => {
  return {
    name: filterData[dataIndexTable.name]?.[0],
    field: filterData[dataIndexTable.field]?.[0],
    status: filterData[dataIndexTable.status]?.[0],
  };
};
function TopicList() {
  const { tableStyle } = useContext(AntdSettingContext);
  const [tableBorder] = tableStyle;
  const location = useLocation();
  const userStorage = authService.getCurrentUser();
  const { pathname } = location;
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataFilterStatus, setDataFilterStatus] = useState([]);
  const [dataFilterField, setDataFilterField] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [dataPaging, dispatch] = useReducer(pageReducer, INITIAL_PAGE_STATE);

  useEffect(() => {
    //for cleanup funtion
    // const controller = new AbortController();

    setLoading(true);
    topicService
      .getAllByUsernameWithFilter(
        userStorage.username,
        dataPaging.current - 1,
        dataPaging.pageSize,
        convertFilterToParams(filteredInfo)
        // {
        //   signal: controller.signal,
        // }
      )
      .then((data) => {
        setTableData(generateTableData(data.data.content));
        dispatch({
          type: 'FETCH',
          totalElements: data.data.totalElements,
          pageSize: data.data.size,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        openNotificationWithIcon('error', null, 'top');
      });
    //cleanup function
    // return () => {
    //   controller.abort();
    // };
  }, [dataPaging.current, filteredInfo]);

  useEffect(() => {
    const callApi = () => {
      setLoading(true);
      statusService
        .getAll()
        .then((data) => {
          const statusFilter = data.data.map((status, i) => {
            return { text: status.title, value: JSON.stringify(status) };
          });
          setDataFilterStatus(statusFilter);
          return fieldService.getAll();
        })
        .then((data) => {
          const fieldFilter = data.data.map((field, i) => {
            return { text: field.title, value: JSON.stringify(field) };
          });
          setDataFilterField(fieldFilter);
          setLoading(false);
        });
    };
    callApi();
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
          to={routesConfig[ROLES.employee].topicDetail}
          state={{
            topicId: record[dataIndexTable.id],
            previousPath: pathname,
          }}
          replace={true}
        >
          {text}
        </Link>
      ),
      filteredValue: filteredInfo[dataIndexTable.name] || null,
      ...getColumnSearchProps(dataIndexTable.name, 'tên đề tài'),
    },
    {
      title: 'Thời gian thực hiện',
      dataIndex: dataIndexTable.time,
    },
    {
      title: 'Lĩnh vực',
      dataIndex: dataIndexTable.field,
      align: 'center',
      filters: dataFilterField,
      filteredValue: filteredInfo[dataIndexTable.field] || null,
      filterMultiple: false,
      filterIcon: (filtered) => (
        <FilterOutlined
          style={{
            color: filtered ? '#1890ff' : undefined,
            fontSize: 18,
          }}
        />
      ),
      ellipsis: true, // ẩn nếu dài
    },
    {
      title: 'Trạng thái',
      dataIndex: dataIndexTable.status,
      align: 'center',
      filters: dataFilterStatus,
      filteredValue: filteredInfo[dataIndexTable.status] || null,
      filterMultiple: false,
      filterIcon: (filtered) => (
        <FilterOutlined
          style={{
            color: filtered ? '#1890ff' : undefined,
            fontSize: 18,
          }}
        />
      ),
      ellipsis: true, // ẩn nếu dài
    },
  ];
  const handleTableChange = (pagination, filters, sorter) => {
    console.log('filters data : ', filters);
    //control filter reset
    setFilteredInfo(filters);
  };
  const getPaginationProps = () => {
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
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to={routesConfig[ROLES.employee].home}>Trang chủ</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Đề tài</Breadcrumb.Item>
        <Breadcrumb.Item>Danh sách</Breadcrumb.Item>
      </Breadcrumb>
      <CustomDivider text={'Danh sách đề tài'} />
      <Row justify="end" style={{ marginBottom: 20 }}>
        <Col>
          <Button
            onClick={() => {
              if (Object.keys(filteredInfo).length !== 0) setFilteredInfo({});
            }}
            type="primary"
          >
            <ClearOutlined style={{ fontSize: antdIconFontSize }} />
            Xóa bộ lọc
          </Button>
        </Col>
      </Row>
      <Table
        bordered={tableBorder}
        rowSelection={{
          ...rowSelection,
        }}
        pagination={getPaginationProps()}
        columns={columns}
        dataSource={tableData}
        loading={loading}
        onChange={handleTableChange}
      />
    </>
  );
}

export default TopicList;
