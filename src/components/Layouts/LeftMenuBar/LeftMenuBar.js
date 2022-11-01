import { Link, NavLink } from 'react-router-dom';
import { routes as routesConfig } from 'configs/general';
import { menuBarLeftType } from 'configs/general';
function LeftMenuBar({ type }) {
  const organContent = [
    {
      to: routesConfig.organCreate,
      text: 'Tạo mới',
    },
    {
      to: routesConfig.organList,
      text: 'Danh sách',
    },
  ];
  const topicContent = [];
  let content;
  switch (type) {
    case menuBarLeftType.organ:
      content = organContent;
      break;
    case menuBarLeftType.topic:
      content = topicContent;
      break;
  }
  return (
    <div className="ui pointing vertical menu">
      {content.map((c, i) => {
        return (
          <NavLink key={i} className="item" to={c.to}>
            {c.text}
          </NavLink>
        );
      })}
    </div>
  );
}

export default LeftMenuBar;
