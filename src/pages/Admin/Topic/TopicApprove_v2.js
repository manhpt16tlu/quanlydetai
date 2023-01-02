import {
  Breadcrumb,
  Button,
  Col,
  message,
  Popconfirm,
  Result,
  Row,
  Space,
  Table,
} from 'antd';
import {
  FilterOutlined,
  SearchOutlined,
  ClearOutlined,
  WarningOutlined,
  DeleteOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import CustomDivider from 'components/General/CustomDivider';
import * as topicService from 'services/TopicService';
import * as organService from 'services/OrganService';
import { ROLES, routes as routesConfig } from 'configs/general';
import { Link, useLocation } from 'react-router-dom';
import { useContext, useEffect, useReducer, useState } from 'react';
import { AntdSettingContext } from 'context/AntdSettingContext';
import {
  INITIAL_PAGE_STATE,
  openNotificationWithIcon,
  pageReducer,
  generateMoneyString,
} from 'utils/general';
import { generateDateString } from 'utils/topicUtil';

const dataIndexTable = {
  id: 'madetai',
  name: 'tendetai',
  organ: 'coquanchutri',
  time: 'thoigianthuchien',
  expense: 'kinhphi',
};
const generateTableData = (data) => {
  // console.log(data);
  return data.map((topic, index) => ({
    key: index,
    [dataIndexTable.id]: topic.id,
    [dataIndexTable.name]: topic.name,
    [dataIndexTable.organ]: topic.manager.organ.name,
    [dataIndexTable.time]: generateDateString(topic.startDate, topic.endDate),
    [dataIndexTable.expense]: generateMoneyString(topic.expense),
  }));
};
const convertFilterToParams = (filterData) => {
  return {
    organ: filterData[dataIndexTable.organ]?.[0],
  };
};
function TopicApproveV2() {
  const location = useLocation();
  const { pathname } = location;
  const { tableStyle } = useContext(AntdSettingContext);
  const [tableBorder] = tableStyle;
  const [dataPaging, dispatch] = useReducer(pageReducer, INITIAL_PAGE_STATE);
  const [dataFilterOrgan, setDataFilterOrgan] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [selectedRows, setSelectedRows] = useState({
    keys: [],
    data: [],
  });
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
    selectedRowKeys: selectedRows.keys, // controlled selected row key
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows({
        keys: selectedRowKeys,
        data: selectedRows,
      });
    },
  };
  const handleTableChange = (pagination, filters, sorter) => {
    //control filter reset
    setFilteredInfo(filters);
  };
  const columns = [
    {
      title: 'Tên đề tài',
      dataIndex: dataIndexTable.name,
      width: '40%',
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
    },
    {
      title: 'Cơ quan chủ trì',
      dataIndex: dataIndexTable.organ,
      filters: dataFilterOrgan,
      filteredValue: filteredInfo[dataIndexTable.organ] || null,
      filterSearch: true,
      filterMultiple: false,
      // width: '20%',
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
      title: 'Thời gian thực hiện',
      dataIndex: dataIndexTable.time,
    },
    {
      title: 'Kinh phí (đ)',
      dataIndex: dataIndexTable.expense,
      ellipsis: true,
    },

    {
      title: 'Hành động',
      align: 'center',

      render: (_, record) => {
        return (
          <>
            <Space size={10}>
              <Button
                onClick={() => handleApprove(record[dataIndexTable.id])}
                type="primary"
                style={{
                  backgroundColor: '#00b96b',
                }}
              >
                <CheckOutlined />
                Phê duyệt
              </Button>
            </Space>
          </>
        );
      },
    },
  ];
  const handleApprove = async (topicId) => {
    try {
      await topicService.approve(topicId);
      setRefresh((prev) => !prev);
      setSelectedRows({
        keys: [],
        data: [],
      });
      openNotificationWithIcon('success', 'Phê duyệt đề tài', 'top');
    } catch (error) {
      console.log(error);
      openNotificationWithIcon('error', 'Phê duyệt đề tài', 'top');
    }
  };
  const handleApproveAll = () => {
    Promise.all(
      selectedRows.data.map(async (topicRecord, i) => {
        await topicService.approve(topicRecord[dataIndexTable.id]);
      })
    )
      .then(() => {
        setRefresh((prev) => !prev);
        setSelectedRows({
          keys: [],
          data: [],
        });
        openNotificationWithIcon('success', 'Phê duyệt đề tài', 'top');
      })
      .catch((err) => {
        console.log(err);
        message.error('Có lỗi xảy ra');
      });
  };
  useEffect(() => {
    const callApi = async () => {
      try {
        setLoading(true);
        // prettier-ignore
        const pageResponse = (await topicService.getNotApproveTopicList(dataPaging.current - 1,dataPaging.pageSize,convertFilterToParams(filteredInfo)))?.data;
        dispatch({
          type: 'FETCH',
          totalElements: pageResponse.totalElements,
          pageSize: pageResponse.size,
          tableData: generateTableData(pageResponse.content ?? []),
        });
        setLoading(false);
      } catch (error) {
        console.log(error);
        message.error('Có lỗi xảy ra');
      }
    };
    callApi();
  }, [dataPaging.current, filteredInfo, refresh]);
  useEffect(() => {
    const callApi = async () => {
      try {
        setLoading(true);
        const organs = (await organService.getAllNoPaging())?.data;
        const organsFilter = organs.map((organ, i) => ({
          text: organ.name ?? organ.title,
          value: JSON.stringify(organ),
        }));
        setDataFilterOrgan(organsFilter);
        setLoading(false);
      } catch (error) {
        console.log(error);
        message.error('Có lỗi xảy ra');
      }
    };
    callApi();
  }, []);
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to={routesConfig[ROLES.admin].home}>Trang chủ</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Đề tài</Breadcrumb.Item>
        <Breadcrumb.Item>Phê duyệt</Breadcrumb.Item>
      </Breadcrumb>
      <CustomDivider text="Danh sách đề tài cần phê duyệt" />
      <Row justify="end" style={{ marginBottom: 20 }}>
        <Col>
          <Space>
            {selectedRows.keys.length !== 0 &&
            selectedRows.data.length !== 0 ? (
              <Popconfirm
                placement="bottomRight"
                title="Phê duyệt tất cả đề tài"
                onConfirm={handleApproveAll}
                okText="Có"
                cancelText="Không"
                icon={<WarningOutlined />}
              >
                <Button
                  style={{
                    backgroundColor: '#00b96b',
                  }}
                  type="primary"
                >
                  <CheckCircleOutlined />
                  Phê duyệt tất cả
                </Button>
              </Popconfirm>
            ) : null}
            <Button
              onClick={() => {
                setRefresh((prev) => !prev);
                setSelectedRows({
                  keys: [],
                  data: [],
                });
              }}
              type="primary"
            >
              <SyncOutlined />
              Làm mới
            </Button>
          </Space>
        </Col>
      </Row>
      {dataPaging?.tableData?.length > 0 ? (
        <Table
          bordered={tableBorder}
          rowSelection={rowSelection}
          pagination={paginationProps}
          columns={columns}
          dataSource={dataPaging?.tableData}
          loading={loading}
          onChange={handleTableChange}
        />
      ) : (
        <Result
          style={{ marginTop: 100 }}
          status="info"
          icon={<CheckCircleOutlined />}
          title="Không có đề tài nào cần phê duyệt !"
        />
      )}
    </>
  );
}

export default TopicApproveV2;
