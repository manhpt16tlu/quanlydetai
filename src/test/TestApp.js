// import Component from './MyComponent';
import 'antd/dist/antd.css';
import { Button } from 'antd';
function TestApp() {
  return (
    <Button disabled block loading={{ delay: 50 }}>
      Click
    </Button>
  );
}

export default TestApp;
