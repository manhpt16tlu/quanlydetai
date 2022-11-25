import { Spin, Typography, Collapse, Row, Col, Button, Result } from 'antd';
import { SmileOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import { CaretRightOutlined } from '@ant-design/icons';
import style from './TopicApprove.module.scss';
import * as topicService from 'services/TopicService';
import * as organService from 'services/OrganService';
import { openNotificationWithIcon } from 'utils/general';
import { processPanelsData } from 'utils/topicUtil';
const { Panel } = Collapse;
const { Title } = Typography;
function TopicApprove() {
  console.log('topic approve render');
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
        console.log('call api');
        const response = await organService.getAllWhichNeedApprove();
        setDataOrgan(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        openNotificationWithIcon('error', null, 'top');
      }
    };
    getData();
  }, [refresh]);

  //ignore call process method meaningless
  const panelsData = useMemo(() => {
    return processPanelsData(dataOrgan);
  }, [dataOrgan]);
  return (
    <Spin spinning={loading}>
      <Row justify="end">
        <Col>
          <Button
            onClick={() => {
              setRefresh((prev) => !prev);
            }}
            type="primary"
          >
            Làm mới
          </Button>
        </Col>
      </Row>
      {dataOrgan.length ? (
        <Collapse
          accordion
          bordered={false}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined
              style={{ fontSize: 17, verticalAlign: 'middle' }}
              rotate={isActive ? 90 : 0}
            />
          )}
          onChange={onPanelClick}
        >
          {panelsData}
        </Collapse>
      ) : (
        <Result
          style={{ marginTop: 100 }}
          status="info"
          icon={<CheckCircleOutlined />}
          title="Không có đề tài nào cần phê duyệt !"
          // extra={<Button type="primary">Next</Button>}
        />
      )}
    </Spin>
  );
}

export default TopicApprove;
