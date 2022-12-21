const optionSelectFill = (data) => {
  //option with value is string id
  return data.map((v, i) => {
    return {
      title: v.description,
      value: v.id,
      label: v.title ?? v.name,
    };
  });
};
const optionSelectFillOBJ = (data) => {
  //option with value is object
  return data.map((v, i) => {
    return {
      title: v.description,
      value: JSON.stringify(v),
      label: v.title ?? v.name,
    };
  });
};
const INITIAL_PAGE_STATE = {
  current: 1,
  pageSize: 7,
  totalElements: null,
  tableData: [],
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
        tableData: action.tableData,
      };
    default:
      return state;
  }
};

export {
  optionSelectFill,
  optionSelectFillOBJ,
  INITIAL_PAGE_STATE,
  pageReducer,
};
