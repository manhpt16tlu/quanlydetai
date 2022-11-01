import { useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import style from './Organ.module.scss';
import LeftMenuBar from 'components/Layouts/LeftMenuBar/LeftMenuBar';
function Organ() {
  return (
    <div className="ui two column grid">
      <div className="four wide column">
        <LeftMenuBar type="organ" />
      </div>
      <div className="twelve wide column">
        <Outlet />
      </div>
    </div>
  );
}

export default Organ;
