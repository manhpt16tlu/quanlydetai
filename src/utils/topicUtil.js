import { Collapse, Typography } from 'antd';
import style from 'pages/Admin/Topic/TopicApprove.module.scss';
import TableDataPanel from 'components/Topic/TableDataPanel';
const { Panel } = Collapse;
const { Title, Text } = Typography;
//fill option for organ,field,status,result of topic
const optionSelectFillOBJ = (data) => {
  //option with value is object
  return data.map((v, i) => {
    return {
      title: v.description ?? v.name ?? v.title, //hiển thị khi hover
      value: JSON.stringify(v),
      label: v.title ?? v.name, // hiển thị ra giao diện
    };
  });
};
const optionSelectFill = (data) => {
  //option with value is string id
  return data.map((v, i) => {
    return {
      title: v.description ?? v.name,
      value: v.id,
      label: v.title ?? v.name,
    };
  });
};

//method for topic approve logic
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
const generateDateString = (startDate, endDate) => {
  const s = new Date(startDate);
  const e = new Date(endDate);
  return s.getMonth() == e.getMonth() && s.getFullYear() == e.getFullYear()
    ? `${s.getMonth() + 1}/${s.getFullYear()}`
    : `${s.getMonth() + 1}/${s.getFullYear()} - ${
        e.getMonth() + 1
      }/${e.getFullYear()}`;
};
export {
  generateDateString,
  optionSelectFillOBJ,
  optionSelectFill,
  processPanelsData,
};
