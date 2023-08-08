import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { parseCookies } from 'nookies';
import styles from "./styles/friendsider.module.scss";

function FriendSider() {
  const [friendsData, setFriendsData] = useState([]);

  const cookies = parseCookies();
  const accessToken = cookies.accessToken || '';

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/friends/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        console.log(response);
        setFriendsData(response.data.data.users);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarfeature}>
        <div className={styles.my}>
          <div className={styles.myPicture}></div>
          <p className={styles.userName}>你的名字</p>
        </div>
        <div className={styles.myFriends}>
          <img className={styles.friendsIcon} src="/image/Vector.png" />
          <p className={styles.myFriendlist}>我的好友</p>
        </div>
        <div className={styles.buddy}>
          {friendsData.map((friend) => (
            <div className={styles.buddy} key={friend.id}>
              <img
                className={styles.buddyPicture}
                src={friend.picture}
                alt={friend.name}
              />
              <p className={styles.buddyText}>{friend.name}</p>
            </div>
          ))}
        </div>
        <div className={styles.viewAll}>
          <img className={styles.viewAllIcon} src="/image/options 1.png" />
          <p className={styles.viewAllText}>查看全部</p>
        </div>
        <p className={styles.CanChuAbout}>
          關於我們 · 隱私權條款 · Cookie 條款 · <br />© 2023 CanChu, Inc.
        </p>
      </div>
    </div>
  );
}

export default FriendSider;
