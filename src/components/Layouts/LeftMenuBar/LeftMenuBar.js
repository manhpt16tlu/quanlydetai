import { Link, NavLink } from 'react-router-dom';
import routes from 'routes/config';
function LeftMenuBar({ type }) {
  const organContent = [
    {
      to: routes.organCreate,
      text: 'Tạo mới',
    },
    {
      to: routes.organList,
      text: 'Danh sách',
    },
  ];
  const topicContent = [];
  let content;
  switch (type) {
    case 'organ':
      content = organContent;
      break;
    case 'topic':
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
