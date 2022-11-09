import { useState } from 'react';
import cln from 'classnames';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { routes as routesConfig } from 'configs/general';
const links = [
  {
    to: routesConfig.home,
    text: 'Trang chủ',
  },
  {
    to: routesConfig.organ,
    text: 'Cơ quan',
  },
  {
    to: routesConfig.topic,
    text: 'Đề tài',
  },
];
function Header() {
  const loc = useLocation();
  return (
    <div className="ui menu big">
      {links.map((l, i) => {
        const classes = cln({
          item: true,
          active: loc.pathname === l.to ? true : false,
        });
        return (
          <Link className={classes} key={i} to={l.to}>
            {l.text}
          </Link>
        );
      })}
      <div className="right menu">
        <a className="item">Đăng xuất</a>
      </div>
    </div>
  );
}

export default Header;
