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
export {
  optionSelectFillOBJ,
  optionSelectFill,
  INITIAL_PAGE_STATE,
  pageReducer,
};
