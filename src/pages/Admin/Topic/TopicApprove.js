import { CheckCircleOutlined, SyncOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Collapse,
  message,
  Result,
  Row,
  Spin,
  Typography,
} from 'antd';
import CustomDivider from 'components/General/CustomDivider';
import MyCollapse from 'components/Topic/MyCollapse';
import TableDataPanel from 'components/Topic/TableDataPanel';
import { antdIconFontSize } from 'configs/general';
import style from 'pages/Admin/Topic/TopicApprove.module.scss';
import { useEffect, useMemo, useState } from 'react';
import * as organService from 'services/OrganService';
const { Panel } = Collapse;
const { Text } = Typography;
const processPanelsData = (organs) => {
  console.log('process panel data');
  const panels = organs.map((organ, index, thisArr) => {
    return (
      <Panel
        style={
          {
            // border: 'none',
          }
        }
        className={style.panel}
        header={<Text strong>{organ.name}</Text>}
        key={organ.id}
      >
        <TableDataPanel
          organId={organ.id}
          numberOfTopic={organ.numberOfTopic} // force render table when after approve
        />
      </Panel>
    );
  });
  return panels;
};
function TopicApprove() {
  const [loading, setLoading] = useState(false);
  const [dataOrgan, setDataOrgan] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const onPanelClick = (key) => {
    // console.log(key); // key of collapse is string
  };

  useEffect(() => {
    setLoading(true); // display icon loading
    const getData = async () => {
      try {
        const response = await organService.getAllWhichNeedApprove();
        setDataOrgan(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        message.error('Có lỗi xảy ra');
      }
    };
    getData();
  }, [refresh]);

  //ignore call process method meaningless
  const panelsData = useMemo(() => {
    return processPanelsData(dataOrgan);
  }, [dataOrgan]);
  return (
    <>
      <CustomDivider text={'Danh sách đề tài cần phê duyệt'} />
      <Spin spinning={loading}>
        <Row justify="end" style={{ marginBottom: 10 }}>
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
        {dataOrgan.length ? (
          <MyCollapse panelsData={panelsData} />
        ) : (
          <Result
            style={{ marginTop: 100 }}
            status="info"
            icon={<CheckCircleOutlined />}
            title="Không có đề tài nào cần phê duyệt !"
          />
        )}
      </Spin>
    </>
  );
}

export default TopicApprove;
