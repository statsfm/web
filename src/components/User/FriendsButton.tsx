import type { FC } from 'react';
import { useState } from 'react';
import type { UserPublic } from '@statsfm/statsfm.js';
import { FriendStatus } from '@statsfm/statsfm.js';
import { useApi } from '@/hooks';
import { FriendsButtonFrame } from './FriendsButtonFrame';

// TODO: Change to useEffect

export const FriendsButton: FC<{
  friendUser: UserPublic;
  initialFriendStatus: FriendStatus;
}> = ({ friendUser, initialFriendStatus }) => {
  const api = useApi();
  const [friendStatus, setFriendStatus] =
    useState<FriendStatus>(initialFriendStatus);

  const handleAccept = () => {
    api.friends.acceptRequest(friendUser.id);
    setFriendStatus(FriendStatus.FRIENDS);
  };

  const handleRemove = () => {
    api.friends.remove(friendUser.id);
    setFriendStatus(FriendStatus.NONE);
  };

  const handleCancel = () => {
    api.friends.cancelRequest(friendUser.id);
    setFriendStatus(FriendStatus.NONE);
  };

  const handleSend = () => {
    api.friends.sendRequest(friendUser.id);
    setFriendStatus(FriendStatus.REQUEST_OUTGOING);
  };

  switch (friendStatus) {
    case FriendStatus.FRIENDS:
      return (
        <FriendsButtonFrame red handler={handleRemove}>
          Remove friend
        </FriendsButtonFrame>
      );
    case FriendStatus.REQUEST_INCOMING:
      return (
        <FriendsButtonFrame handler={handleAccept}>
          Accept friend request
        </FriendsButtonFrame>
      );
    case FriendStatus.REQUEST_OUTGOING:
      return (
        <FriendsButtonFrame red handler={handleCancel}>
          Cancel friend request
        </FriendsButtonFrame>
      );
    default:
      return (
        <FriendsButtonFrame handler={handleSend}>
          Send friend request
        </FriendsButtonFrame>
      );
  }
};
