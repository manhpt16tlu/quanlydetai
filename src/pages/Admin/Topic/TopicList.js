import {
  FilterOutlined,
  SearchOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import {
  Button,
  Col,
  Divider,
  Input,
  Row,
  Space,
  Table,
  Typography,
} from 'antd';
import { routes as routesConfig, antdIconFontSize } from 'configs/general';
import React, { useEffect, useReducer, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as organService from 'services/OrganService';
import * as topicService from 'services/TopicService';
import * as statusService from 'services/TopicStatusService';
import { openNotificationWithIcon } from 'utils/general';
import CustomDivider from 'components/General/CustomDivider';
import { generateDateString } from 'utils/topicUtil';
import { INITIAL_PAGE_STATE, pageReducer } from 'utils/general';
const dataIndexTable = {
  id: 'id',
  name: 'tendetai',
  manager: 'chunhiem',
  time: 'thoigianthuchien',
  status: 'trangthai',
};
const rowSelection = {
  type: 'checkbox',
  onChange: (selectedRowKeys, selectedRows) => {},
  getCheckboxProps: (record) => {
    return {};
  },
};

const generateTableData = (data) => {
  // console.log(data);
  return data.map((topic, index) => ({
    key: index,
    [dataIndexTable.id]: topic.id,
    [dataIndexTable.name]: topic.name,
    [dataIndexTable.organ]: topic.organ.name,
    [dataIndexTable.manager]: topic.manager,
    [dataIndexTable.status]: topic.topicStatus.title,
    [dataIndexTable.time]: generateDateString(topic.startDate, topic.endDate),
  }));
};
function TopicList() {
  const { Title } = Typography;
  const location = useLocation();
  const { pathname } = location;
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataFilterOrgan, setDataFilterOrgan] = useState([]);
  const [dataFilterStatus, setDataFilterStatus] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [dataPaging, dispatch] = useReducer(pageReducer, INITIAL_PAGE_STATE);
  useEffect(() => {
    console.log('call api');

    //for cleanup funtion
    const controller = new AbortController();

    setLoading(true);
    topicService
      .getFilteredApproved(
        filteredInfo[dataIndexTable.name]?.[0],
        filteredInfo[dataIndexTable.organ],
        filteredInfo[dataIndexTable.manager]?.[0],
        filteredInfo[dataIndexTable.status]?.[0],
        dataPaging.current - 1,
        dataPaging.pageSize,
        {
          signal: controller.signal,
        }
      )
      .then((data) => {
        setTableData(generateTableData(data.data.content));
        dispatch({
          type: 'FETCH',
          totalElements: data.data.totalElements,
          pageSize: data.data.size,
        });
        return statusService.getAll();
      })
      .then((data) => {
        const statusFilter = data.data
          .filter((status, i) => status.title !== 'Chưa duyệt')
          .map((status, i) => {
            return { text: status.title, value: status.title };
          });
        setDataFilterStatus(statusFilter);
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
    //cleanup function
    return () => {
      controller.abort();
    };
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
          state={{
            [btoa('topicId')]: btoa(record[dataIndexTable.id]),
            previousPath: pathname,
          }}
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
      // filterMultiple: false, //cho phép lọc theo nhiều hay không
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
    <>
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
            Clear all filter
          </Button>
        </Col>
      </Row>
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
    </>
  );
}

export default TopicList;
