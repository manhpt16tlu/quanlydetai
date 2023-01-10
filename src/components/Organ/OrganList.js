import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  WarningOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  message,
  Popconfirm,
  Space,
  Spin,
  Table,
} from 'antd';
import {
  antdIconFontSize,
  MESSAGE_REQUIRE,
  TIMESTAMP_FORMAT,
} from 'configs/general';
import { AntdSettingContext } from 'context/AntdSettingContext';
import moment from 'moment';
import { memo, useContext, useEffect, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import * as organService from 'services/OrganService';
import { INITIAL_PAGE_STATE, pageReducer } from 'utils/general';
import { openNotificationWithIcon } from 'utils/general';
const { TextArea } = Input;
const dataIndexTable = {
  id: 'ma',
  name: 'tencoquan',
  address: 'diachi',
  email: 'email',
  createDate: 'ngaytao',
};
const rowSelection = {
  type: 'checkbox',
  onChange: (selectedRowKeys, selectedRows) => {},
};

const generateTableData = (organs) => {
  return organs.map((organ, index) => ({
    key: index,
    [dataIndexTable.id]: organ.id,
    [dataIndexTable.name]: organ.name,
    [dataIndexTable.createDate]: moment(organ.createDate).format(
      TIMESTAMP_FORMAT
    ),
    [dataIndexTable.email]: organ.email,
    [dataIndexTable.address]: organ.address,
  }));
};
const getFormItemEdit = (formItemName, type) => {
  const rules = [
    {
      required: true,
      message: MESSAGE_REQUIRE,
    },
  ];
  if (type === 'email')
    rules.push({
      type: 'email',
      message: 'Email không hợp lệ',
    });
  return (
    <Form.Item
      style={{
        margin: 0,
      }}
      name={formItemName}
      rules={rules}
    >
      <TextArea
        autoSize={{
          minRows: 1,
          maxRows: 2,
        }}
      />
    </Form.Item>
  );
};
const convertFilterToParams = (filterData) => {
  return {
    name: filterData[dataIndexTable.name]?.[0],
  };
};
function OrganList({ refresh }) {
  const { tableStyle } = useContext(AntdSettingContext);
  const [tableBorder] = tableStyle;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [callApiAgain, setCallApiAgain] = useState(false);
  const [dataPaging, dispatch] = useReducer(pageReducer, INITIAL_PAGE_STATE);
  const [editingKey, setEditingKey] = useState(undefined);
  const paginationProps = {
    current: dataPaging.current,
    pageSize: dataPaging.pageSize,
    total: dataPaging.totalElements,
    onChange: (page, pageSize) => {
      setEditingKey(undefined); // exist edit
      dispatch({
        type: 'PAGE_CHANGE',
        current: page,
        pageSize: pageSize,
      });
    },
  };
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
            disabled={editingKey !== undefined}
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
              disabled={editingKey !== undefined}
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
              disabled={editingKey !== undefined}
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
  const tableColumn = [
    {
      title: 'Tên cơ quan',
      dataIndex: dataIndexTable.name,
      width: '25%',
      filteredValue: filteredInfo[dataIndexTable.name] || null,
      render: (text, record) => {
        if (editingKey === record.key) {
          return getFormItemEdit(dataIndexTable.name);
        } else return <Link>{text}</Link>;
      },
      ...getColumnSearchProps(dataIndexTable.name, 'tên cơ quan'),
      editable: true,
    },
    {
      title: 'Địa chỉ',
      // width: '20%',
      dataIndex: dataIndexTable.address,
      render: (text, record) => {
        if (editingKey === record.key) {
          return getFormItemEdit(dataIndexTable.address);
        } else return <span>{text}</span>;
      },
      editable: true,
    },
    {
      title: 'Email',
      dataIndex: dataIndexTable.email,
      // width: '20%',
      render: (text, record) => {
        if (editingKey === record.key) {
          return getFormItemEdit(dataIndexTable.email, 'email');
        } else return <span>{text}</span>;
      },
      editable: true,
    },
    {
      title: 'Ngày tạo',
      dataIndex: dataIndexTable.createDate,
    },
    {
      title: 'Hành động',
      align: 'center',

      render: (_, record) => {
        const editable = isEditing(record);

        return !editable ? (
          <Button
            type="primary"
            onClick={() => edit(record)}
            disabled={editingKey !== undefined}
          >
            <EditOutlined
              style={{
                fontSize: antdIconFontSize,
              }}
            />
            Chỉnh sửa
          </Button>
        ) : (
          <>
            <Space size={10}>
              <Button
                type="primary"
                onClick={() => onFinishEdit(record[dataIndexTable.id])}
              >
                <CheckCircleOutlined
                  style={{
                    fontSize: antdIconFontSize,
                  }}
                />
                Lưu
              </Button>
              <Popconfirm
                placement="topLeft"
                title="Hủy chỉnh sửa"
                onConfirm={() => setEditingKey(undefined)}
                okText="Có"
                cancelText="Không"
                icon={<WarningOutlined />}
              >
                <Button type="primary" danger>
                  <CloseCircleOutlined
                    style={{
                      fontSize: antdIconFontSize,
                    }}
                  />
                  Hủy
                </Button>
              </Popconfirm>
            </Space>
          </>
        );
      },
    },
  ];
  const onFinishEdit = async (organId) => {
    const dataEdit = form.getFieldsValue();

    try {
      await organService.update(organId, {
        name: dataEdit[dataIndexTable.name],
        address: dataEdit[dataIndexTable.address],
        email: dataEdit[dataIndexTable.email],
      });
      openNotificationWithIcon('success', 'Cập nhật', 'top');
      setEditingKey(undefined);
      setCallApiAgain((prev) => !prev);
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
  };
  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      [dataIndexTable.name]: record[dataIndexTable.name],
      [dataIndexTable.email]: record[dataIndexTable.email],
      [dataIndexTable.address]: record[dataIndexTable.address],
    });
    setEditingKey(record.key);
  };
  const handleTableChange = (pagination, filters, sorter) => {
    //control filter reset
    setFilteredInfo(filters);
  };
  useEffect(() => {
    const callApi = async () => {
      setLoading(true);
      const pageResponse = (
        await organService.getAllWithFilter(
          dataPaging.current - 1,
          dataPaging.pageSize,
          convertFilterToParams(filteredInfo)
        )
      )?.data;
      dispatch({
        type: 'FETCH',
        totalElements: pageResponse.totalElements,
        pageSize: pageResponse.size,
        tableData: generateTableData(pageResponse?.content ?? []),
      });
      setLoading(false);
    };
    callApi();
  }, [dataPaging.current, refresh, callApiAgain, filteredInfo]);

  return (
    <>
      <Spin spinning={loading}>
        <Form form={form} component={false}>
          <Table
            onChange={handleTableChange}
            bordered={tableBorder}
            rowSelection={rowSelection}
            columns={tableColumn}
            dataSource={dataPaging?.tableData}
            pagination={paginationProps}
          />
        </Form>
      </Spin>
    </>
  );
}

export default memo(OrganList);
