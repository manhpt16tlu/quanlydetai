import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import * as organService from 'services/OrganService';
function OrganCreate() {
  const [dataInput, setDataInput] = useState({
    ten: '',
    diachi: '',
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!dataInput.diachi.trim() || !dataInput.ten.trim()) {
      toast.error('Input field can not empty or blank', {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      toast.promise(
        organService.create({
          name: dataInput.ten,
          address: dataInput.diachi,
        }),
        {
          pending: 'Pending',
          success: 'Success',
          error: 'Error',
        },
        { position: toast.POSITION.BOTTOM_CENTER }
      );
    }
    setDataInput({
      ten: '',
      diachi: '',
    });
  };
  const handleChange = (e) => {
    const name = e.target.name;
    const data = e.target.value;
    setDataInput((prev) => ({
      ...prev,
      [name]: data,
    }));
  };
  return (
    <>
      <form className="ui form large segment teal" onSubmit={handleSubmit}>
        <div className="eight wide field">
          <label>Tên cơ quan</label>
          <input
            placeholder="Tên cơ quan"
            value={dataInput.ten}
            name="ten"
            onChange={handleChange}
          />
        </div>
        <div className="eight wide field">
          <label>Địa chỉ</label>
          <input
            placeholder="Địa chỉ"
            value={dataInput.diachi}
            name="diachi"
            onChange={handleChange}
          />
        </div>
        <button className="ui button large" type="submit">
          Submit
        </button>
      </form>
      <ToastContainer autoClose={1200} />
    </>
  );
}

export default OrganCreate;
