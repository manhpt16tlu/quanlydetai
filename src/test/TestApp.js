// import Component from './MyComponent';
import 'antd/dist/antd.css';
import { Button, Form, Input } from 'antd';
import { useState } from 'react';
function TestApp() {
  const [s, setS] = useState({ name: 'm' });
  const [form] = Form.useForm();
  const click = () => {
    setS({
      name: 's',
    });
    form.resetFields();
  };
  console.log('render');
  return (
    <>
      <Form form={form} initialValues={s}>
        <Form.Item name="name">
          <Input />
        </Form.Item>
      </Form>
      <button onClick={click}>click</button>
    </>
  );
}

export default TestApp;
