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
  let currentIndex;
  const loc = useLocation();
  links.forEach((l, i) => {
    if (l.to === loc.pathname) {
      currentIndex = i;
      return;
    }
  });
  const [active, setActive] = useState(currentIndex);
  links.forEach((e, i) => {
    e.click = function (i) {
      setActive(i);
    };
  });
  return (
    <div className="ui menu">
      {links.map((l, i) => {
        const classes = cln({
          item: true,
          active: active == i ? true : false,
        });
        return (
          <Link
            className={classes}
            key={i}
            to={l.to}
            onClick={() => l.click(i)}
          >
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
