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
      text: 'Xem và chỉnh sửa',
    },
  ];
  const topicContent = [
    {
      to: routesConfig.topicCreate,
      text: 'Tạo mới',
    },
    {
      to: routesConfig.topicList,
      text: 'Xem và chỉnh sửa',
    },
    {
      to: routesConfig.topicApprove,
      text: 'Phê duyệt',
    },
  ];
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
    <>
      <div className="ui pointing secondary vertical menu">
        {content.map((c, i) => {
          return (
            <NavLink key={i} className="item" to={c.to}>
              {c.text}
            </NavLink>
          );
        })}
      </div>
    </>
  );
}

export default LeftMenuBar;
