const getFileList = (e) => {
  if (Array.isArray(e)) return e;
  return e?.fileList;
};
export { getFileList };
