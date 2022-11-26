import { Collapse } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
function MyCollapse(props) {
  return (
    <Collapse
      accordion
      bordered={false}
      expandIcon={({ isActive }) => (
        <CaretRightOutlined
          style={{ fontSize: 17, verticalAlign: 'middle' }}
          rotate={isActive ? 90 : 0}
        />
      )}
    >
      {props.panelsData}
    </Collapse>
  );
}

export default MyCollapse;
