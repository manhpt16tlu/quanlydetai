import { Divider, Typography } from 'antd';
function CustomDivider(props) {
  const { Title } = Typography;
  return (
    <Divider orientation={props.orientation ?? 'center'}>
      <Title level={props.size ?? 4}>{props.text}</Title>
    </Divider>
  );
}

export default CustomDivider;
