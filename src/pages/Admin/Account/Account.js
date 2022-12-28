import { FilterOutlined, WarningOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { Breadcrumb, Button, message, Popconfirm, Space, Table } from 'antd';
import CustomDivider from 'components/General/CustomDivider';
import { Link } from 'react-router-dom';
import moment from 'moment';
import {
  ROLES,
  routes as routesConfig,
  TIMESTAMP_FORMAT,
} from 'configs/general';
import { useContext, useEffect, useReducer, useState } from 'react';
import { AntdSettingContext } from 'context/AntdSettingContext';
import {
  INITIAL_PAGE_STATE,
  openNotificationWithIcon,
  pageReducer,
} from 'utils/general';
import * as userSerivce from 'services/UserService';
import * as organService from 'services/OrganService';
const dataIndexTable = {
  id: 'manguoidung',
  fullname: 'tennguoidung',
  username: 'tentaikhoan',
  organ: 'coquanchutri',
  disabled: 'vohieuhoa',
  createDate: 'ngaytao',
};
const generateTableData = (data) => {
  // console.log(data);
  return data.map((user, index) => ({
    key: index,
    [dataIndexTable.id]: user.id,
    [dataIndexTable.username]: user.username,
    [dataIndexTable.organ]: user.organ.name,
    [dataIndexTable.createDate]: moment(user.createDate).format(
      TIMESTAMP_FORMAT
    ),
    [dataIndexTable.disabled]: user.disabled,
  }));
};
const convertFilterToParams = (filterData) => {
  return {
    organ: filterData[dataIndexTable.organ]?.[0],
  };
};
const rowSelection = {
  type: 'checkbox',
  onChange: (selectedRowKeys, selectedRows) => {},
};
function Account() {
  const { tableStyle } = useContext(AntdSettingContext);
  const [tableBorder] = tableStyle;
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [dataFilterOrgan, setDataFilterOrgan] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [dataPaging, dispatch] = useReducer(pageReducer, INITIAL_PAGE_STATE);

  const handleDisabledUser = (userId, disabled) => {
    userSerivce
      .disableUser(userId)
      .then(() => {
        setRefresh((prev) => !prev);
        openNotificationWithIcon(
          'success',
          null,
          'top',
          `Đã ${disabled ? 'kích hoạt' : 'vô hiệu hóa'} tài khoản`
        );
      })
      .catch((err) => {
        console.log(err);
        message.error('Có lỗi xảy ra');
      });
  };
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
  const columns = [
    {
      title: 'Tên tài khoản',
      dataIndex: dataIndexTable.username,
      width: '40%',
      render: (text, record) => (
        <Link
          style={
            record[dataIndexTable.disabled]
              ? {
                  color: '#ff4d4f',
                }
              : null
          }
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
    { title: 'Ngày tạo', dataIndex: dataIndexTable.createDate },
    {
      title: 'Hành động',
      align: 'center',

      render: (_, record) => {
        return (
          <>
            <Space size={10}>
              <Popconfirm
                placement="bottomRight"
                title={`${
                  record[dataIndexTable.disabled] ? `Kích hoạt` : `Vô hiệu hóa`
                } tài khoản này `}
                onConfirm={() =>
                  handleDisabledUser(
                    record[dataIndexTable.id],
                    record[dataIndexTable.disabled]
                  )
                }
                okText="Có"
                cancelText="Không"
                icon={<WarningOutlined />}
              >
                <Button
                  {...{
                    danger: !record[dataIndexTable.disabled],
                  }}
                  type="primary"
                >
                  <FontAwesomeIcon
                    icon={record[dataIndexTable.disabled] ? faLockOpen : faLock}
                    style={{
                      marginRight: 5,
                    }}
                  />
                  {record[dataIndexTable.disabled]
                    ? `Kích hoạt`
                    : `Vô hiệu hóa`}
                </Button>
              </Popconfirm>
            </Space>
          </>
        );
      },
    },
  ];
  const handleTableChange = (pagination, filters, sorter) => {
    //control filter reset
    setFilteredInfo(filters);
  };
  useEffect(() => {
    const callApi = async () => {
      try {
        setLoading(true);
        // prettier-ignore
        const pageResponse = (await userSerivce.getAllUser(dataPaging.current - 1,dataPaging.pageSize,convertFilterToParams(filteredInfo)))?.data;

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
        <Breadcrumb.Item>Tài khoản</Breadcrumb.Item>
      </Breadcrumb>
      <CustomDivider text="Danh sách tài khoản" />
      <Table
        bordered={tableBorder}
        rowSelection={rowSelection}
        pagination={paginationProps}
        columns={columns}
        dataSource={dataPaging?.tableData}
        loading={loading}
        onChange={handleTableChange}
      />
    </>
  );
}

export default Account;
