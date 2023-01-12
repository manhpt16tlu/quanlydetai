import {
  BankOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { Card, Avatar, Image, message } from 'antd';
import cover from 'assets/images/bg.png';
import defaultAvatar from 'assets/images/default_avatar.jpg';
import * as avatarService from 'services/UserAvatarService';
import * as fileService from 'services/UploadFileService';
import { useEffect, useState } from 'react';
import { generateManagerName } from 'utils/general';
import { FILE_TYPE } from 'configs/general';
const { Meta } = Card;
function UserCard({ userData }) {
  //prettier-ignore
  const [avatarResourceResponse, setAvatarResourceResponse] = useState(undefined);
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
  const getAvatarFromResourceResponse = (response) => {
    if (response) {
      const url = URL.createObjectURL(response.data);
      return url;
    }
    return null;
  };
  useEffect(() => {
    const callApi = async () => {
      //prettier-ignore
      try {
        const avatarFileInfor = (await avatarService.getAvatarFileOfUser(userData.username))?.data;
        let resourceResponse;
        if (avatarFileInfor) {
          resourceResponse = await fileService.download(FILE_TYPE.avatar,avatarFileInfor.code,
            {
              responseType: 'blob',
            }
          );
        }
        setAvatarResourceResponse(resourceResponse);
      } catch (error) {
        console.log(error);
        message.error('Có lỗi xảy ra');
      }
    };
    callApi();
  }, [userData]);
  return (
    <>
      <Card
        // size="default"
        bordered={false}
        // style={{
        //   width: 300,
        // }}
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
          avatar={
            <Avatar
              style={{ border: '1px solid #d9d9d9' }}
              size={60}
              src={
                <Image
                  src={
                    getAvatarFromResourceResponse(avatarResourceResponse) ??
                    defaultAvatar
                  }
                />
              }
            />
          }
          title={title}
          description={description}
        />
      </Card>
    </>
  );
}

export default UserCard;
