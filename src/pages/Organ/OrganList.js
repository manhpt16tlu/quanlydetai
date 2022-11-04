import { useEffect, useRef, useState } from 'react';
import * as organService from '../../services/OrganService';
import style from './OrganList.module.scss';
import { Input, Space } from 'antd';
import cln from 'classnames';
function OrganList() {
  const [organs, setOrgans] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [pageData, setPageData] = useState({
    size: null,
    total: null,
    current: 0,
    pages: [],
  });
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
  const RowUpdate = ({ organ, stt }) => {
    return (
      <tr className="">
        <td className="center aligned">{stt + 1}</td>
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
  const RowNormal = ({ organ, stt }) => {
    return (
      <tr className={isUpdate ? 'disabled' : null}>
        <td className="center aligned">{stt + 1}</td>
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

  const onChangePage = (p) => {
    if (p >= 0 && p < pageData.total) {
      setPageData((prev) => ({
        ...prev,
        current: p,
      }));
    }
  };

  useEffect(() => {
    organService.getAll(pageData.current).then((data) => {
      console.log('call api');
      let temp = [];
      for (let i = 0; i < data.data.totalPages; i++) {
        let classLinkPage = cln('item', {
          active: i === pageData.current,
        });
        temp.push(
          <a key={i} className={classLinkPage} onClick={() => onChangePage(i)}>
            {i + 1}
          </a>
        );
      }
      setOrgans(data.data.content);
      setPageData({
        ...pageData,
        size: data.data.size,
        total: data.data.totalPages,
        pages: temp,
      });
    });
  }, [isUpdate, pageData.current]);

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
                <RowNormal
                  organ={o}
                  key={i}
                  stt={pageData.size * pageData.current + i}
                />
              ) : (
                <RowUpdate
                  organ={o}
                  key={i}
                  stt={pageData.size * pageData.current + i}
                />
              );
            })}
          </tbody>
          <tfoot className="">
            <tr className="">
              <th colSpan="4" className="">
                <div className="ui pagination right floated menu">
                  <a
                    className="icon item"
                    onClick={() => onChangePage(pageData.current - 1)}
                  >
                    <i aria-hidden="true" className="chevron left icon"></i>
                  </a>
                  {pageData.pages}
                  <a
                    className="icon item"
                    onClick={() => onChangePage(pageData.current + 1)}
                  >
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
