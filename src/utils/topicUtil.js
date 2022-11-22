import { Collapse, Typography } from 'antd';
import style from 'pages/Topic/TopicApprove.module.scss';
import TableDataPanel from 'components/Topic/TableDataPanel';
const { Panel } = Collapse;
const { Title, Text } = Typography;
//fill option for organ,field,status,result of topic
const optionSelectFillOBJ = (data) => {
  //option with value is object
  return data.map((v, i) => {
    return {
      title: v.description ?? v.name,
      value: JSON.stringify(v),
      label: v.title ?? v.name,
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
const INITIAL_PAGE_STATE = {
  current: 1,
  pageSize: 2,
  totalElements: null,
};
const pageReducer = (state, action) => {
  switch (action.type) {
    case 'PAGE_CHANGE':
      return {
        ...state,
        current: action.current,
        pageSize: action.pageSize,
      };
    case 'FETCH':
      return {
        ...state,
        totalElements: action.totalElements,
        pageSize: action.pageSize,
      };
    default:
      return state;
  }
};

//method for topic approve logic
const processPanelsData = (organs) => {
  console.log('process panel data');
  const panels = organs.map((organ, index) => {
    return (
      <Panel
        style={{
          border: 'none',
        }}
        className={style.panel}
        header={<Text strong>{organ.name}</Text>}
        key={organ.id}
      >
        <TableDataPanel organId={organ.id} />
      </Panel>
    );
  });
  return panels;
};
export {
  optionSelectFillOBJ,
  optionSelectFill,
  INITIAL_PAGE_STATE,
  pageReducer,
  processPanelsData,
};
