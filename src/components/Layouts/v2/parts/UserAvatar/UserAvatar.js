import { Avatar, Image, message } from 'antd';
import defaultAvatar from 'assets/images/default_avatar.jpg';
import * as avatarService from 'services/UserAvatarService';
import * as fileService from 'services/UploadFileService';
import { useEffect, useState, memo } from 'react';
import { FILE_TYPE } from 'configs/general';
function UserAvatar({ username }) {
  const [avatarResourceResponse, setAvatarResourceResponse] =
    useState(undefined);
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
            const avatarFileInfor = (await avatarService.getAvatarFileOfUser(username))?.data;
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
  }, []);
  return (
    <Avatar
      size="large"
      src={
        <Image
          preview={false}
          src={
            getAvatarFromResourceResponse(avatarResourceResponse) ??
            defaultAvatar
          }
        />
      }
    />
  );
}

export default memo(UserAvatar);
