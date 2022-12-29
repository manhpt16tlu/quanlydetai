import {
  FilterOutlined,
  SearchOutlined,
  ClearOutlined,
  WarningOutlined,
  DeleteOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  Col,
  Divider,
  Input,
  Popconfirm,
  Popover,
  Row,
  Space,
  Table,
  Typography,
} from 'antd';
import {
  routes as routesConfig,
  antdIconFontSize,
  ROLES,
  TOPIC_STATUS_DEFAULT,
} from 'configs/general';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as organService from 'services/OrganService';
import * as topicService from 'services/TopicService';
import * as statusService from 'services/TopicStatusService';
import {
  capitalizeFirstLetterEachWord,
  openNotificationWithIcon,
} from 'utils/general';
import CustomDivider from 'components/General/CustomDivider';
import { generateDateString } from 'utils/topicUtil';
import { INITIAL_PAGE_STATE, pageReducer } from 'utils/general';
import { AntdSettingContext } from 'context/AntdSettingContext';
import UserCard from 'components/Account/UserCard';
const dataIndexTable = {
  id: 'id',
  name: 'tendetai',
  manager: 'chunhiem',
  organ: 'coquanchutri',
  time: 'thoigianthuchien',
  status: 'trangthai',
  accountDetail: 'thongtinchitiettaikhoan',
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
  // prettier-ignore
  return data.map((topic, index) => ({
    key: index,
    [dataIndexTable.id]: topic.id,
    [dataIndexTable.name]: topic.name,
    [dataIndexTable.organ]: topic.manager.organ.name,
    [dataIndexTable.manager]: `${topic.manager?.rank?.name ?? ''}. ${capitalizeFirstLetterEachWord(topic.manager.name)}`,
    [dataIndexTable.status]: topic.topicStatus.title,
    [dataIndexTable.time]: generateDateString(topic.startDate, topic.endDate),
    [dataIndexTable.accountDetail]:topic.manager
  }));
};
const convertFilterToParams = (filterData) => {
  return {
    name: filterData[dataIndexTable.name]?.[0],
    organ: filterData[dataIndexTable.organ]?.[0],
    manager: filterData[dataIndexTable.manager]?.[0],
    status: filterData[dataIndexTable.status]?.[0],
  };
};
function TopicList() {
  const location = useLocation();
  const { pathname } = location;
  const { tableStyle } = useContext(AntdSettingContext);
  const [tableBorder] = tableStyle;
  const [loading, setLoading] = useState(false);
  const [dataFilterOrgan, setDataFilterOrgan] = useState([]);
  const [dataFilterStatus, setDataFilterStatus] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [reload, setReload] = useState(false);
  const [dataPaging, dispatch] = useReducer(pageReducer, INITIAL_PAGE_STATE);
  useEffect(() => {
    setLoading(true);
    topicService
      .getAllByAdminWithFilter(
        dataPaging.current - 1,
        dataPaging.pageSize,
        convertFilterToParams(filteredInfo)
      )
      .then((response) => {
        dispatch({
          type: 'FETCH',
          totalElements: response.data.totalElements,
          pageSize: response.data.size,
          tableData: generateTableData(response.data?.content ?? []),
        });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        openNotificationWithIcon('error', null, 'top');
      });
  }, [dataPaging.current, filteredInfo, reload]);

  useEffect(() => {
    const callApi = () => {
      setLoading(true);
      statusService
        .getAll()
        .then((data) => {
          const statusFilter = data.data
            .filter(
              (status, i) => status.title !== TOPIC_STATUS_DEFAULT.CHUA_DUYET
            )
            .map((status, i) => {
              return { text: status.title, value: JSON.stringify(status) };
            });
          setDataFilterStatus(statusFilter);
          return organService.getAllNoPaging();
        })
        .then((data) => {
          const organFilter = data.data.map((organ, i) => {
            return {
              text: organ.name ?? organ.title,
              value: JSON.stringify(organ),
            };
          });
          setDataFilterOrgan(organFilter);
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

  const confirmDeleteTopic = (topicId) => {
    topicService
      .deleteById(topicId)
      .then(() => {
        openNotificationWithIcon('success', 'Xóa đề tài', 'top');
        setReload((prev) => !prev);
      })
      .catch((err) => {
        console.log(err);
        openNotificationWithIcon('error', 'Xóa đề tài', 'top');
      });
  };

  const columns = [
    {
      title: 'Tên đề tài',
      dataIndex: dataIndexTable.name,
      width: '30%',
      render: (text, record) => (
        <Link
          to={routesConfig[ROLES.admin].topicDetail}
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
      title: 'Cơ quan chủ trì',
      dataIndex: dataIndexTable.organ,
      filters: dataFilterOrgan,
      filteredValue: filteredInfo[dataIndexTable.organ] || null,
      filterSearch: true,
      filterMultiple: false,
      filterIcon: (filtered) => (
        <FilterOutlined
          style={{
            color: filtered ? '#1890ff' : undefined,
            fontSize: 18,
          }}
        />
      ),
      // filterMultiple: false, //cho phép lọc theo nhiều hay không
      // width: '20%',
    },
    {
      render: (text, record) => (
        <Popover
          content={<UserCard userData={record[dataIndexTable.accountDetail]} />}
          placement="right"
        >
          <span
            style={{
              cursor: 'pointer',
              color: record[dataIndexTable.disabled] ? '#ff4d4f' : '#1890ff',
            }}
          >
            {text}
          </span>
        </Popover>
      ),
      title: 'Chủ nhiệm',
      dataIndex: dataIndexTable.manager,
      filteredValue: filteredInfo[dataIndexTable.manager] || null,
      ...getColumnSearchProps(dataIndexTable.manager, 'tên chủ nhiệm'),
      // width: '20%',
    },
    {
      title: 'Thời gian thực hiện',
      dataIndex: dataIndexTable.time,
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
      // ellipsis: true, // ẩn nếu dài
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
                title="Bạn chắc chắn muốn xóa đề tài này ?"
                onConfirm={() => confirmDeleteTopic(record[dataIndexTable.id])}
                onCancel={() => {}}
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
            </Space>
          </>
        );
      },
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
          <Link to={routesConfig[ROLES.admin].home}>Trang chủ</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Đề tài</Breadcrumb.Item>
        <Breadcrumb.Item>Danh sách</Breadcrumb.Item>
      </Breadcrumb>
      <CustomDivider text={'Danh sách đề tài'} />
      <Row justify="end" style={{ marginBottom: 20 }}>
        <Col>
          <Space>
            <Button
              onClick={() => {
                if (Object.keys(filteredInfo).length !== 0) setFilteredInfo({});
              }}
              type="primary"
            >
              <ClearOutlined style={{ fontSize: antdIconFontSize }} />
              Xóa bộ lọc
            </Button>
            <Button
              onClick={() => {
                setReload((prev) => !prev);
              }}
              type="primary"
            >
              <SyncOutlined style={{ fontSize: antdIconFontSize }} />
              Làm mới
            </Button>
          </Space>
        </Col>
      </Row>
      <Table
        bordered={tableBorder}
        rowSelection={{
          ...rowSelection,
        }}
        pagination={getPaginationProps()}
        columns={columns}
        dataSource={dataPaging?.tableData}
        loading={loading}
        onChange={handleTableChange}
      />
    </>
  );
}

export default TopicList;
