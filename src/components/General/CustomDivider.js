import { Divider, Typography } from 'antd';
function CustomDivider(props) {
  const { Title } = Typography;
  return (
    <Divider>
      <Title level={3}>{props.text}</Title>
    </Divider>
  );
}

export default CustomDivider;
