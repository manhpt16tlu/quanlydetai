import { Outlet } from 'react-router';
import LeftMenuBar from 'components/Layouts/LeftMenuBar/LeftMenuBar';
import { menuBarLeftType } from 'configs/general';
function Topic() {
  return (
    <div className="ui two column grid">
      <div className="four wide column">
        <LeftMenuBar type={menuBarLeftType.topic} />
      </div>
      <div className="twelve wide column">
        <Outlet />
      </div>
    </div>
  );
}

export default Topic;
