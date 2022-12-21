import { CheckCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Col, Result, Row, Spin, Typography, Divider } from 'antd';
import MyCollapse from 'components/Topic/MyCollapse';
import { useEffect, useMemo, useState } from 'react';
import * as organService from 'services/OrganService';
import { openNotificationWithIcon } from 'utils/general';
import { processPanelsData } from 'utils/topicUtil';
import { antdIconFontSize } from 'configs/general';
import CustomDivider from 'components/General/CustomDivider';
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
            // extra={<Button type="primary">Next</Button>}
          />
        )}
      </Spin>
    </>
  );
}

export default TopicApprove;
