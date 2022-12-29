import {
  BankOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { Card, Avatar, Image } from 'antd';
import cover from 'assets/images/bg.png';
import avatar from 'assets/images/default_avatar.jpg';
import { generateManagerName } from 'utils/general';
const { Meta } = Card;
function UserCard({ userData, dataIndex }) {
  const title = (
    <>
      <p style={{ margin: 0 }}>{generateManagerName(userData ?? {})}</p>
    </>
  );
  // prettier-ignore
  const description = (
    <>
      <p style={{ margin: 0 }}><BankOutlined /> {userData?.organ?.name}</p>
      <p style={{ margin: 0 }}><MailOutlined /> react_antd@frontend.com</p>
      <p style={{ margin: 0 }}><PhoneOutlined /> 0336826448</p>
      <p style={{ margin: 0 }}><HomeOutlined /> Trần Phú Hà Đông, Bắc Kinh</p>
    </>
  );
  return (
    <>
      <Card
        bordered={false}
        style={{
          width: 300,
        }}
        cover={
          <div
            style={{
              height: 100,
              width: '100%',
              backgroundRepeat: 'no-repeat',
              backgroundImage: `url(${cover})`,
              backgroundSize: 'auto 250%',
              backgroundPosition: 'center 30%',
            }}
          ></div>
        }
      >
        <Meta
          avatar={<Avatar size={60} src={<Image src={avatar} />} />}
          title={title}
          description={description}
        />
      </Card>
    </>
  );
}

export default UserCard;
