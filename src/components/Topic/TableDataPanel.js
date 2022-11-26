import { useEffect, useState } from 'react';
import { Table, Button, Row, Col, Space } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import * as topicService from 'services/TopicService';
import { openNotificationWithIcon } from 'utils/general';
import { generateDateString } from 'utils/topicUtil';
import { routes as routesConfig } from 'configs/general';
// component for panel collapse
function TableDataPanel(props) {
  const location = useLocation();
  const { pathname } = location;
  console.log('table data panel render');
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState({
    keys: [],
    data: [],
  });
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
    selectedRowKeys: selectedRows.keys, // controlled selected row key
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows({
        keys: selectedRowKeys,
        data: selectedRows,
      });
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
  const onApproveClick = async () => {
    await Promise.all(
      selectedRows.data.map(async (topicRecord, index) => {
        await topicService.approve(topicRecord[dataIndexTable.id], {
          topicStatus: {
            title: 'Đã duyệt',
          },
        });
      })
    )
      .then(() => {
        openNotificationWithIcon('success', 'Phê duyệt đề tài', 'top');
        setSelectedRows({
          keys: [],
          data: [],
        }); //reset selected

        setReload((prev) => !prev); //call api again
      })
      .catch((error) => {
        console.log(error);
        openNotificationWithIcon('error', null, 'top');
      });
    // selectedData.forEach((topicRecord, index, thisArr) => {
    //   topicService
    //     .approve(topicRecord[dataIndexTable.id], {
    //       topicStatus: {
    //         title: 'Đã duyệt',
    //       },
    //     })
    //     .then(() => {
    //       // console.log(selectedData);
    //       // setSelectedData((prev) => {
    //       //   //remove checkbox selected
    //       //   return prev.filter(
    //       //     (prevRecord) =>
    //       //       prevRecord[dataIndexTable.id] !== topicRecord[dataIndexTable.id]
    //       //   );
    //       // });
    //       if (index + 1 === thisArr.length) {
    //         openNotificationWithIcon('success', 'Phê duyệt đề tài', 'top');
    //         setReload((prev) => !prev); //call api again
    //       }
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //       openNotificationWithIcon('error', 'Phê duyệt đề tài', 'top');
    //     });
    // });
  };
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
  }, [reload]);
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
              disabled={
                selectedRows.keys.length === 0 || selectedRows.data.length === 0
              }
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
