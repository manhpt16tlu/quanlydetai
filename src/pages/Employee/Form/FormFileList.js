import {
  DownloadOutlined,
  SyncOutlined,
  SearchOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  Col,
  Divider,
  Input,
  message,
  Row,
  Space,
  Spin,
  Table,
} from 'antd';
import CustomDivider from 'components/General/CustomDivider';
import {
  antdIconFontSize,
  TIMESTAMP_FORMAT,
  routes as routesConfig,
  ROLES,
  FILE_TYPE,
} from 'configs/general';
import { AntdSettingContext } from 'context/AntdSettingContext';
import moment from 'moment';
import { useContext, useEffect, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import * as formService from 'services/FormService';
import * as uploadSerivce from 'services/UploadFileService';
import { INITIAL_PAGE_STATE, pageReducer } from 'utils/general';
import { getFileNameFromHeaderDisposition } from 'utils/general';

const dataIndexTable = {
  id: 'ma',
  name: 'tenbieumau',
  type: 'loai',
  date: 'ngaybanhanh',
};
const convertFilterToParams = (filterData) => {
  return {
    name: filterData[dataIndexTable.name]?.[0],
    type: filterData[dataIndexTable.type]?.[0],
  };
};
function FormFileList() {
  const { tableStyle } = useContext(AntdSettingContext);
  const [tableBorder] = tableStyle;
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [dataPaging, dispatch] = useReducer(pageReducer, INITIAL_PAGE_STATE);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [dataFilterFormType, setDataFilterFormType] = useState([]);

  const generateTableData = (forms) => {
    return forms.map((form, index) => ({
      key: index,
      [dataIndexTable.name]: form.name,
      [dataIndexTable.date]: moment(form.createDate).format(TIMESTAMP_FORMAT),
      [dataIndexTable.type]: form.type.title,
      [dataIndexTable.id]: form.id,
    }));
  };

  const handleDownloadForm = async (formId) => {
    const form = (await formService.getFormById(formId).catch((err) => {}))
      ?.data;
    const formFile = (
      await formService.getFormFileByFormId(form?.id).catch((err) => {})
    )?.data;
    if (form && formFile) {
      uploadSerivce
        .download(FILE_TYPE.form, formFile.code, {
          responseType: 'blob',
        })
        .then((response) => {
          //get filename from header
          const disposition = response.headers['content-disposition'];
          const filename = getFileNameFromHeaderDisposition(disposition);
          const a = document.createElement('a');
          const url = URL.createObjectURL(response.data);
          a.href = url;
          a.download = filename;
          a.click();
          URL.revokeObjectURL(url);
        })
        .catch((err) => {
          console.log(err);
          message.error('File không tồn tại');
        });
    } else message.error('File không tồn tại');
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
  const tableColumn = [
    {
      title: 'Tên biểu mẫu',
      dataIndex: dataIndexTable.name,
      width: '45%',
      render: (text, record) => <Link>{text}</Link>,
      filteredValue: filteredInfo[dataIndexTable.name] || null,
      ...getColumnSearchProps(dataIndexTable.name, 'tên biểu mẫu'),
    },
    {
      title: 'Loại',
      width: '20%',
      dataIndex: dataIndexTable.type,
      filters: dataFilterFormType,
      filteredValue: filteredInfo[dataIndexTable.type] || null,
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
    },
    {
      title: 'Ngày ban hành',
      dataIndex: dataIndexTable.date,
    },
    {
      align: 'center',
      title: 'Hành động',
      render: (_, record) => {
        return (
          <Button
            type="primary"
            onClick={() => handleDownloadForm(record[dataIndexTable.id])}
          >
            <DownloadOutlined
              style={{
                fontSize: antdIconFontSize,
              }}
            />
            Tải xuống
          </Button>
        );
      },
    },
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    //control filter reset
    setFilteredInfo(filters);
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
  const rowSelection = {
    type: 'checkbox',
    onChange: (selectedRowKeys, selectedRows) => {},
  };

  useEffect(() => {
    console.log('formlist call api');
    const callApi = async () => {
      setLoading(true);
      const pageResponse = (
        await uploadSerivce.getAllForm(
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
  }, [dataPaging.current, filteredInfo, refresh]);
  useEffect(() => {
    const callApi = async () => {
      try {
        setLoading(true);
        const formTypeList = (await formService.getAllFormType())?.data;
        const formTypeListFilter = formTypeList.map((type, i) => ({
          text: type.name ?? type.title,
          value: JSON.stringify(type),
        }));
        setDataFilterFormType(formTypeListFilter);
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
          <Link to={routesConfig[ROLES.employee].home}>Trang chủ</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Biểu mẫu</Breadcrumb.Item>
      </Breadcrumb>

      <CustomDivider orientation="center" text="Danh sách biểu mẫu" />
      <Row justify="end" style={{ marginBottom: 20 }}>
        <Col>
          <Button
            onClick={() => {
              setRefresh((prev) => !prev);
            }}
            type="primary"
          >
            <SyncOutlined style={{ fontSize: antdIconFontSize }} />
            Làm mới
          </Button>
        </Col>
      </Row>
      <Spin spinning={loading}>
        <Table
          onChange={handleTableChange}
          bordered={tableBorder}
          rowSelection={rowSelection}
          columns={tableColumn}
          dataSource={dataPaging?.tableData}
          pagination={paginationProps}
        />
      </Spin>
    </>
  );
}

export default FormFileList;
