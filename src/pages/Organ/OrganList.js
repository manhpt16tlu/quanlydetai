import { Input } from 'antd';
import cln from 'classnames';
import { routes as routesConfig } from 'configs/general';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as organService from '../../services/OrganService';
import style from './OrganList.module.scss';
function OrganList() {
  const [organs, setOrgans] = useState([]);
  const [pageData, setPageData] = useState({
    size: null,
    total: null,
    current: 0,
    pages: [],
  });
  const [searchTerm, setSearchTearm] = useState('');
  const navigage = useNavigate();
  const { Search } = Input;

  const Row = ({ organ, stt }) => {
    return (
      <tr className="">
        <td className="center aligned">{stt + 1}</td>
        <td className="">{organ.name}</td>
        <td className="">{organ.address}</td>
        <td className="">
          <button className="ui button fluid" onClick={() => onEdit(organ)}>
            <i aria-hidden="true" className="setting icon fitted"></i>
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
    organService.getAll(pageData.current, searchTerm).then((data) => {
      console.log('effect 1 call api', data);
      setOrgans(data.data.content);
      setPageData((prev) => ({
        ...prev,
        size: data.data.size,
        total: data.data.totalPages,
      }));
    });
  }, [pageData.current, searchTerm]);
  useEffect(() => {
    console.log('effect 2 display pagination');
    if (pageData.total != null) {
      let temp = [];
      for (let i = 0; i < pageData.total; i++) {
        let classLinkPage = cln('item', {
          active: i === pageData.current,
        });
        temp.push(
          <a key={i} className={classLinkPage} onClick={() => onChangePage(i)}>
            {i + 1}
          </a>
        );
      }
      setPageData((prev) => ({
        ...prev,
        pages: temp,
      }));
    }
  }, [pageData.total, pageData.current]);
  const onSearch = (value) => {
    if (value.trim()) setSearchTearm(value);
    else setSearchTearm('');
  };
  const onEdit = (data) => {
    navigage(routesConfig.organDetail, { state: data });
  };
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
      <table className={`ui teal celled fixed table`}>
        <thead className="">
          <tr className="">
            <th className="one wide center aligned">STT</th>
            <th className="center aligned">Tên cơ quan</th>
            <th className="center aligned">Địa chỉ</th>
            <th className="two wide"></th>
          </tr>
        </thead>
        <tbody className="">
          {organs.map((o, i) => {
            return (
              <Row
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
    </div>
  );
}

export default OrganList;
