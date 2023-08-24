/* eslint-disable no-undef */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable no-shadow */

"use client"


import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from "axios";
import { parseCookies, setCookie } from 'nookies';
import { UserProvider } from './UsersContext';
import styles from "./styles/PersonalPage.module.scss";
import Navbar from "./navbar";
import PersonalSider from "./PersonalSidebar";
import PostDetailPage from "./postDetailPage";
import SaySomething from "./SaySomething";
import Footer from "./footer";
import Personaldata from "./Personaldata";
import Scroll from './hooks/Scroll';

function PersonalPage() {
  const [myPhoto, setMyPhoto] = useState(null);
  const [isHoveringPhoto, setIsHoveringPhoto] = useState(false);
  const myPhotoRef = useRef(null);
  const editPhotoRef = useRef(null);
  const fileInputRef = useRef(null);
  // const [posts, setPosts] = useState([]);
  const [posts, setPosts, nextCursor] = Scroll(); 
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEditPhoto, setShowEditPhoto] = useState(false);
  const dropContainerRef = useRef(null);
  

  const cookies = parseCookies();
  const accessToken = cookies.accessToken || '';
  const userName = cookies.userName || '';

  const fetchPosts = useCallback(() => {
    axios(`${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/search`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        console.log(response);
        setPosts(response.data.data.posts);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [accessToken, setPosts]);

  useEffect(() => {
    const storedPhoto = cookies.userPhoto;

    if (storedPhoto && !myPhoto) {
      setMyPhoto(storedPhoto);
    }
  }, [cookies, myPhoto]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleFileChange = (event) => {
    fileInputRef.current.removeEventListener('change', handleFileChange);
    setSelectedFile(event.target.files[0]);
    setShowEditPhoto(false);

    const formData = new FormData();
    formData.append('picture', event.target.files[0]);

    axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/picture`, formData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      console.log(response);
      setMyPhoto(response.data.data.picture);

      setCookie(null, 'userPhoto', response.data.data.picture, {
        maxAge: 30 * 24 * 60 * 60, 
        path: '/',
      });
      fileInputRef.current.addEventListener('change', handleFileChange);
    })
    .catch((error) => {
      console.log(error);
      fileInputRef.current.addEventListener('change', handleFileChange);
    });
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        myPhotoRef.current &&
        editPhotoRef.current &&
        !myPhotoRef.current.contains(event.target) &&
        !editPhotoRef.current.contains(event.target)
      ) {
        setShowEditPhoto(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handlePostSuccess = (postContent) => {
    axios(`${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/search`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        console.log(response);
        setPosts(response.data.data.posts)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setMyPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleEditPhotoClick = (event) => {
    event.stopPropagation();
    console.log('編輯大頭貼被點擊');
    fileInputRef.current.click();
  };

  return (
    <UserProvider>
      <div className={styles.container}>
        <Navbar/>
        <div className={styles.AboutMeBar}>
          <div className={styles.AboutMeplace}>
            <div className={styles.MyPhotoplace}>
              <div
                className={styles.HoverMy}
                ref={dropContainerRef}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onMouseEnter={() => setIsHoveringPhoto(true)}
                onMouseLeave={() => setIsHoveringPhoto(false)}
              >
                <img
                  className={styles.MyPhoto}
                  src={myPhoto}
                  alt="My Photo"
                  ref={myPhotoRef}
                />
                {isHoveringPhoto && (
                  <label
                    className={`${styles.editPhoto} ${styles.editPhotoText}`}
                    ref={editPhotoRef}
                    onClick={handleEditPhotoClick}
                    style={{ backgroundColor: 'transparent' }}
                    htmlFor="fileInput"
                  >
                    編輯大頭貼
                  </label>
                )}
              </div>
              <div className={styles.Yours}>
                <div className={styles.YourName}>{userName}</div>
                <p className={styles.YourfriendCount}>
                  {Personaldata().friend_count}位朋友
                </p>
              </div>
            </div>
            <div className={styles.postbar}>
              <p className={styles.postbarFeed}>貼文</p>
              <div className={styles.postbarLine}></div>
            </div>
          </div>
        </div>
        <div className={styles.PersonalPagelayout}>
          <div className={styles.PersonalSidebar}>
            <PersonalSider />
          </div>
          <div className={styles.PersonalPagePost}>
            <SaySomething
              userPhoto={myPhoto}
              onPostSuccess={handlePostSuccess}
            />
            {posts.map((post) => (
              <PostDetailPage
                key={post.id}
                post={post}
                shouldHideData={false}
                userPhoto={myPhoto}
              />
            ))}
            <Footer />
          </div>
        </div>
      </div>
      <input
        id="fileInput"
        ref={fileInputRef}
        type="file"
        accept=".png, .jpg, .jpeg"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        readOnly
      />
    </UserProvider>
  );
}

export default PersonalPage;