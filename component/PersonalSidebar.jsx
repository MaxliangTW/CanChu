import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from "next/navigation";
import { parseCookies, setCookie } from 'nookies';
import styles from './styles/PersonalSidebar.module.scss';

function PersonalSider() {
  const [editMode, setEditMode] = useState(false);
  const [introduction, setIntroduction] = useState('');
  const [tags, setTags] = useState('');
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    const cookies = parseCookies();
    setAccessToken(cookies.accessToken);
    const introductionFromCookie = cookies.introduction || '';
    const tagsFromCookie = cookies.tags || '';
    const userId = cookies.user_id;
    const userName = cookies.userName || '';

    setIntroduction(introductionFromCookie);
    setTags(tagsFromCookie);
  }, []);

  const handleEditButtonClick = () => {
    setEditMode(!editMode);
  };

  const handleProfileUpdate = async () => {
    try {
      const data = {
        name: userName,
        introduction,
        tags,
      };

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      };

      await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/profile`, data, config);

      setEditMode(false);

      // 將用戶的自我介紹和興趣數據保存到cookies中
      setCookie(null, 'introduction', introduction, {
        maxAge: 30 * 24 * 60 * 60, // 30天過期
        path: '/',
      });
      setCookie(null, 'tags', tags, {
        maxAge: 30 * 24 * 60 * 60, // 30天過期
        path: '/',
      });

      axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const data = response.data.data;
        setIntroduction(data.introduction);
        setTags(data.tags);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.Personalsidebarfeature}>
        <button
          className={styles.AddPersonalText}
          onClick={handleEditButtonClick}
          disabled={editMode}
        >
          編輯個人檔案
        </button>
        {editMode ? (
          // 編輯模式
          <>
            <div className={styles.PersonalAbout}>自我介紹</div>
            <textarea
              className={`${styles.introduction} ${styles['edit-mode']}`}
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
            />
            <div className={styles.AboutTags}>興趣</div>
            <textarea
              className={`${styles.Tags} ${styles['edit-mode']}`}
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <div className={styles.Buttons}>
              <button className={`${styles.confirm}`} onClick={handleProfileUpdate}>
                確認
              </button>
              <button className={`${styles.cancel}`} onClick={handleEditButtonClick}>
                取消
              </button>
            </div>
          </>
        ) : (
          // 非編輯模式
          <>
            <div className={styles.PersonalAbout}>自我介紹</div>
            <div className={styles.introduction}>{introduction}</div>
            <div className={styles.AboutTags}>興趣</div>
            <div className={styles.Tags}>{tags}</div>
          </>
        )}
        <p className={styles.Aboutus}>
          關於我們 · 隱私權條款 · Cookie 條款 · <br />© 2023 CanChu, Inc.
        </p>
      </div>
    </div>
  );
};

export default PersonalSider;