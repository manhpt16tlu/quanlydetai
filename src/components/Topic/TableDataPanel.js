import { useEffect, useState } from 'react';
import { Table, Button, Row, Col, Space } from 'antd';
import { Link } from 'react-router-dom';
import * as topicService from 'services/TopicService';
import { openNotificationWithIcon } from 'utils/general';
import { generateDateString } from 'utils/topicUtil';
import { routes as routesConfig } from 'configs/general';
// component for panel collapse
function TableDataPanel(props) {
  console.log('table data panel render');
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const dataIndexTable = {
    id: 'id',
    name: 'tendetai',
    organ: 'coquanchutri',
    manager: 'chunhiem',
    time: 'thoigianthuchien',
    field: 'linhvuc',
  };
  const columns = [
    {
      title: 'Tên đề tài',
      dataIndex: dataIndexTable.name,
      render: (text, record) => (
        <Link to={routesConfig.topicDetail}>{text}</Link>
      ),
      width: '30%',
    },
    {
      title: 'Lĩnh vực',
      dataIndex: dataIndexTable.field,
      width: '23%',
    },
    {
      title: 'Chủ nhiệm',
      dataIndex: dataIndexTable.manager,
      width: '25%',
    },
    {
      title: 'Thời gian thực hiện',
      dataIndex: dataIndexTable.time,
      align: 'center',
    },
  ];
  const rowSelection = {
    type: 'checkbox',
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedData(selectedRows);
    },
    // getCheckboxProps: (record) => {},
  };
  const generateTableData = (data) => {
    return data.map((topic, index) => ({
      key: index,
      [dataIndexTable.id]: topic.id,
      [dataIndexTable.name]: topic.name,
      [dataIndexTable.field]: topic.topicField.title,
      [dataIndexTable.manager]: topic.manager,
      [dataIndexTable.time]: generateDateString(topic.startDate, topic.endDate),
    }));
  };
  const onApproveClick = () => {};
  useEffect(() => {
    setLoading(true);
    const getData = async () => {
      try {
        console.log('call api');
        const response = await topicService.getNonApprovedByOrganId(
          props.organId
        );
        setTableData(generateTableData(response.data));
        setLoading(false);
      } catch (error) {
        console.log(error);
        openNotificationWithIcon('error', null, 'top');
      }
    };
    getData();
  }, []);
  return (
    <>
      <Space
        direction="vertical"
        size="middle"
        style={{
          display: 'flex',
        }}
      >
        <Table
          pagination={false}
          loading={loading}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={tableData}
        />
        <Row justify="end">
          <Col>
            <Button
              onClick={onApproveClick}
              disabled={selectedData.length === 0}
              type="primary"
            >
              Phê duyệt
            </Button>
          </Col>
        </Row>
      </Space>
    </>
  );
}
export default TableDataPanel;
