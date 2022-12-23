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

export { optionSelectFill, optionSelectFillOBJ };
