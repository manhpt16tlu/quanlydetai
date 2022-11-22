import { Spin, Typography, Collapse } from 'antd';
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
  const onPanelClick = (key) => {
    // console.log(key); // key of collapse is string
  };
  useEffect(() => {
    setLoading(true); // display icon loading
    const getData = async () => {
      try {
        console.log('call api');
        const response = await organService.getAllNoPaging();
        setDataOrgan(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        openNotificationWithIcon('error', null, 'top');
      }
    };
    getData();
    // topicService
    //   .getAllNoPaging()
    //   .then((data) => {
    //     setDataTopic(data.data);
    //   })
    //   .then(() => {
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }, []);
  const panelsData = useMemo(() => {
    return processPanelsData(dataOrgan);
  }, [dataOrgan]);
  return (
    <Spin spinning={loading}>
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
    </Spin>
  );
}

export default TopicApprove;
