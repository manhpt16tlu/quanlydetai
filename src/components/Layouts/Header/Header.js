import { useState } from 'react';
import cln from 'classnames';
import { Link, NavLink, useLocation } from 'react-router-dom';
import routes from '../../../routes/config';
const links = [
  {
    to: routes.home,
    text: 'Trang chủ',
  },
  {
    to: routes.organ,
    text: 'Cơ quan',
  },
  {
    to: routes.topic,
    text: 'Đề tài',
  },
];
function Header() {
  const loc = useLocation();
  return (
    <div className="ui menu">
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
        <div className="item">
          <div className="ui icon input">
            <input type="text" placeholder="Search..." />
            <i aria-hidden="true" className="search icon"></i>
          </div>
        </div>
        <a className="item">Đăng xuất</a>
      </div>
    </div>
  );
}

export default Header;
