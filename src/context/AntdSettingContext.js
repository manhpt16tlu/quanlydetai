import { ConfigProvider } from 'antd';
import { LOCALSTORAGE_KEY } from 'configs/general';
const { createContext, useState, useEffect } = require('react');

const AntdSettingContext = createContext();

const COMPONENT_SIZE = {
  small: 'small',
  large: 'large',
  middle: 'middle',
};
const TABLE_TYPE_BORDER = {
  border: true,
  noBorder: false,
};
function AntdSettingProvider({ children }) {
  const [size, setSize] = useState(
    localStorage.getItem(LOCALSTORAGE_KEY.componentSize) ?? COMPONENT_SIZE.small
  );
  let tableStyleStore = null;
  if (localStorage.getItem(LOCALSTORAGE_KEY.tableStyle) != null) {
    tableStyleStore =
      localStorage.getItem(LOCALSTORAGE_KEY.tableStyle) === 'true';
  }
  const [tableBorder, setTableBorder] = useState(
    tableStyleStore ?? TABLE_TYPE_BORDER.border
  );
  const value = {
    componentSize: [size, setSize],
    tableStyle: [tableBorder, setTableBorder],
  };
  return (
    <AntdSettingContext.Provider value={value}>
      <ConfigProvider componentSize={size}>{children}</ConfigProvider>
    </AntdSettingContext.Provider>
  );
}

export {
  AntdSettingProvider,
  AntdSettingContext,
  COMPONENT_SIZE,
  TABLE_TYPE_BORDER,
};
