import { TOPIC_RESULT_DEFAULT, TOPIC_STATUS_DEFAULT } from 'configs/general';
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Col, Row, Typography } from 'antd';
const { Title } = Typography;
function Home() {
  const COLORS = ['#0088FE', '#ff4d4f', '#bfbfbf', '#a0d911', '#fadb14'];
  const data01 = [
    { name: TOPIC_RESULT_DEFAULT.DAT, value: 5 },
    { name: TOPIC_RESULT_DEFAULT.KHONG_DAT, value: 10 },
    { name: 'Chưa đánh giá', value: 7 },
    { name: TOPIC_RESULT_DEFAULT.TOT, value: 2 },
    { name: TOPIC_RESULT_DEFAULT.XUAT_SAC, value: 1 },
  ];
  const data02 = [
    { name: TOPIC_STATUS_DEFAULT.DANG_THUC_HIEN, value: 7 },
    { name: TOPIC_STATUS_DEFAULT.DA_NGHIEM_THU, value: 3 },
    { name: TOPIC_STATUS_DEFAULT.CHUA_DUYET, value: 2 },
    { name: TOPIC_STATUS_DEFAULT.DA_PHE_DUYET, value: 5 },
  ];

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
                isAnimationActive={true}
                data={data01}
                cy={200}
                outerRadius={120}
                fill="#8884d8"
                label
              >
                {data01.map((entry, index) => (
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
                isAnimationActive={true}
                data={data02}
                cy={200}
                outerRadius={120}
                fill="#8884d8"
                label
              >
                {data01.map((entry, index) => (
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
