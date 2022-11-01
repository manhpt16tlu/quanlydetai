import { useEffect, useState } from 'react';
import * as organService from '../../services/OrganService';
function OrganList() {
  const [organs, setOrgans] = useState([]);
  useEffect(() => {
    organService.getAll().then((data) => {
      console.log('call api');
      setOrgans(data);
    });
  }, []);
  return (
    <div className="ui container">
      <table className="ui basic table">
        <thead className="">
          <tr className="">
            <th className="">STT</th>
            <th className="">Tên cơ quan</th>
            <th className="">Địa chỉ</th>
            <th className=""></th>
          </tr>
        </thead>
        <tbody className="">
          {organs.map((o, i) => {
            return (
              <tr key={i} className="">
                <td className="">{i}</td>
                <td className="">{o.name}</td>
                <td className="">{o.address}</td>
                <td className="">
                  <button className="ui button mini">Click </button>
                  <button className="ui button mini">Click </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default OrganList;
