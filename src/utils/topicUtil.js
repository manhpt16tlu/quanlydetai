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
export { optionSelectFillOBJ, optionSelectFill };
