import { TOPIC_RESULT_DEFAULT, TOPIC_STATUS_DEFAULT } from 'configs/general';
import * as topicService from 'services/TopicService';
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Col, message, Row, Typography } from 'antd';
import { useEffect } from 'react';
import { useReducer } from 'react';
import produce from 'immer';
const { Title } = Typography;
const chartName = {
  result: 'ketqua',
  status: 'trangthai',
};
const initChartData = {
  [chartName.result]: [],
  [chartName.status]: [],
};
// prettier-ignore
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH':
      return produce(state, (draft) => {
        //dùng immer nên có thể mutate state
        draft[chartName.status] = action.payload[chartName.status];
        draft[chartName.result] = action.payload[chartName.result];
      
      });

    default:
      return state;
  }
};
function Home() {
  const COLORS = ['#0088FE', '#ff4d4f', '#bfbfbf', '#a0d911', '#fadb14'];
  const [chartData, dispatch] = useReducer(reducer, initChartData);

  useEffect(() => {
    // prettier-ignore
    const callApi = async () => {
      try { 
        const CHUA_DUYET = (await topicService.countByStatus({status:TOPIC_STATUS_DEFAULT.CHUA_DUYET}))?.data;
        const DANG_THUC_HIEN = (await topicService.countByStatus({status:TOPIC_STATUS_DEFAULT.DANG_THUC_HIEN}))?.data;
        const DA_PHE_DUYET = (await topicService.countByStatus({status:TOPIC_STATUS_DEFAULT.DA_PHE_DUYET}))?.data;
        const DA_NGHIEM_THU = (await topicService.countByStatus({status:TOPIC_STATUS_DEFAULT.DA_NGHIEM_THU}))?.data;
  
        const DAT = (await topicService.countByResult({result:TOPIC_RESULT_DEFAULT.DAT}))?.data;
        const  KHONG_DAT= (await topicService.countByResult({result:TOPIC_RESULT_DEFAULT.KHONG_DAT}))?.data;
        const KHONG_XAC_DINH = (await topicService.countByResult({result:TOPIC_RESULT_DEFAULT.KHONG_XAC_DINH}))?.data;
        const TOT = (await topicService.countByResult({result:TOPIC_RESULT_DEFAULT.TOT}))?.data;
        const  XUAT_SAC = (await topicService.countByResult({result:TOPIC_RESULT_DEFAULT.XUAT_SAC}))?.data;
        dispatch({
          type:'FETCH',
          payload:{
            [chartName.status]:[
              { name: TOPIC_STATUS_DEFAULT.DANG_THUC_HIEN, value: DANG_THUC_HIEN },
              { name: TOPIC_STATUS_DEFAULT.DA_NGHIEM_THU, value: DA_NGHIEM_THU},
              { name: TOPIC_STATUS_DEFAULT.CHUA_DUYET, value: CHUA_DUYET },
              { name: TOPIC_STATUS_DEFAULT.DA_PHE_DUYET, value:DA_PHE_DUYET }
            ],
            [chartName.result]:[
              { name: TOPIC_RESULT_DEFAULT.DAT, value: DAT },
              { name: TOPIC_RESULT_DEFAULT.KHONG_DAT, value: KHONG_DAT},
              { name: "Chưa được đánh giá",value: KHONG_XAC_DINH },
              { name: TOPIC_RESULT_DEFAULT.TOT, value:TOT },
              { name: TOPIC_RESULT_DEFAULT.XUAT_SAC, value:XUAT_SAC }
            ],
            
          }
        })
      } catch (error) {
        console.log(error);
        message.error('Có lỗi xảy ra');
      }
    
    };
    callApi();
  }, []);

  return (
    <>
      <Row>
        <Col span={12}>
          <Title level={4} style={{ textAlign: 'center' }}>
            Thống kê kết quả đề tài
          </Title>
          <ResponsiveContainer height={500}>
            <PieChart>
              <Pie
                dataKey="value"
                isAnimationActive={false}
                data={chartData[chartName.result]}
                cy={200}
                outerRadius={120}
                fill="#8884d8"
                label
              >
                {chartData[chartName.result].map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend layout="vertical" align="right" />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Col>
        <Col span={12}>
          <Title level={4} style={{ textAlign: 'center' }}>
            Thống kê trạng thái đề tài
          </Title>
          <ResponsiveContainer height={500}>
            <PieChart>
              <Pie
                dataKey="value"
                isAnimationActive={false}
                data={chartData[chartName.status]}
                cy={200}
                outerRadius={120}
                fill="#8884d8"
                label
              >
                {chartData[chartName.status].map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend layout="vertical" align="right" />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Col>
      </Row>
    </>
  );
}

export default Home;
