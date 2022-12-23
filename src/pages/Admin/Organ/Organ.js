import { Breadcrumb, Divider } from 'antd';
import CustomDivider from 'components/General/CustomDivider';
import OrganCreate from 'components/Organ/OrganCreate';
import OrganList from 'components/Organ/OrganList';
import { ROLES, routes as routesConfig } from 'configs/general';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Organ() {
  const [refresh, setRefresh] = useState(false);
  const handleRefresh = useCallback(() => {
    setRefresh((prev) => !prev);
  }, []);

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to={routesConfig[ROLES.admin].home}>Trang chủ</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Cơ quan</Breadcrumb.Item>
      </Breadcrumb>
      <CustomDivider text="Tạo mới" orientation="left" />
      <OrganCreate onRefresh={handleRefresh} />
      <CustomDivider text="Danh sách cơ quan" orientation="left" />
      <OrganList refresh={refresh} />
    </>
  );
}

export default Organ;
