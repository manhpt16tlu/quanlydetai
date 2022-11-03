import { useEffect, useRef, useState } from 'react';
import * as organService from '../../services/OrganService';
import style from './OrganList.module.scss';
import { Input, Space } from 'antd';
function OrganList() {
  const [organs, setOrgans] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const { Search } = Input;

  const onClickUpdate = (e) => {
    e.preventDefault();
    organService
      .update(
        {
          name: e.target['ten'].value,
          address: e.target['diachi'].value,
        },
        e.target['id'].value
      )
      .then(() => {
        setIsUpdate(false);
        setUpdateId(null);
      });
  };
  const onClickEdit = (organ) => {
    setIsUpdate(true);
    setUpdateId(organ.id);
  };
  const RowUpdate = ({ organ, index }) => {
    return (
      <tr className="">
        <td className="center aligned">{index}</td>
        <td className="">
          <input
            defaultValue={organ.name}
            className={style.biggerInput}
            name="ten"
            required
          />
          <input
            defaultValue={organ.id}
            name="id"
            style={{ display: 'none' }}
          />
        </td>
        <td className="">
          <input
            defaultValue={organ.address}
            className={style.biggerInput}
            name="diachi"
            required
          />
        </td>
        <td className="">
          <button type="submit" className="ui teal button">
            OK
          </button>
        </td>
      </tr>
    );
  };
  const RowNormal = ({ organ, index }) => {
    return (
      <tr className={isUpdate ? 'disabled' : null}>
        <td className="center aligned">{index}</td>
        <td className="">{organ.name}</td>
        <td className="">{organ.address}</td>
        <td className="">
          <button
            disabled={isUpdate}
            className="ui button"
            onClick={() => onClickEdit(organ)}
          >
            Edit
          </button>
        </td>
      </tr>
    );
  };
  useEffect(() => {
    organService.getAll().then((data) => {
      console.log('call api');
      setOrgans(data);
    });
  }, [isUpdate]);

  const onSearch = (value) => console.log(value);

  return (
    <div className="ui container">
      <div className={style.searchBar}>
        <Search
          placeholder="input search text"
          onSearch={onSearch}
          size="large"
          style={{
            width: 300,
          }}
        />
      </div>
      <form className={`${style.marginTop}`} onSubmit={onClickUpdate}>
        <table className={`ui teal celled fixed table large`}>
          <thead className="">
            <tr className="">
              <th className="one wide center aligned"></th>
              <th className="center aligned">Tên cơ quan</th>
              <th className="center aligned">Địa chỉ</th>
              <th className="two wide"></th>
            </tr>
          </thead>
          <tbody className="">
            {organs.map((o, i) => {
              return updateId !== o.id ? (
                <RowNormal organ={o} key={i} index={i} />
              ) : (
                <RowUpdate organ={o} key={i} index={i} />
              );
            })}
          </tbody>
          <tfoot className="">
            <tr className="">
              <th colSpan="4" className="">
                <div className="ui pagination right floated menu">
                  <a className="icon item">
                    <i aria-hidden="true" className="chevron left icon"></i>
                  </a>
                  <a className="item">1</a>
                  <a className="item">2</a>
                  <a className="item">3</a>
                  <a className="item">4</a>
                  <a className="icon item">
                    <i aria-hidden="true" className="chevron right icon"></i>
                  </a>
                </div>
              </th>
            </tr>
          </tfoot>
        </table>
      </form>
    </div>
  );
}

export default OrganList;
