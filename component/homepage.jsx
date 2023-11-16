"use client"

import React, { useState, useEffect } from 'react';
import axios from "axios";
import { parseCookies }  from 'nookies';
import styles from "./styles/homePage.module.scss";
import Navbar from "./navbar";
import FriendSider from "./friendsider";
import { UserProvider } from './UsersContext';
import PostDetailPage from "./postDetailPage";
import SaySomething from "./SaySomething";
import Footer from "./footer";
import Scroll from './hooks/Scroll';

const shouldHideData = true;


function HomePage() {
  const [myPhoto, setMyPhoto] = useState("/image/下載.png");
  // const [posts, setPosts] = useState([]);
  const [userName, setUserName] = useState('');
  const cookies = parseCookies();
  const accessToken = cookies.accessToken || '';
  const [posts, setPosts, nextCursor, hasMorePosts] = Scroll();

  useEffect(() => {
    const storedPhoto = cookies.userPhoto;
    if (storedPhoto) {
      setMyPhoto(storedPhoto);
    }
  }, [cookies.userPhoto]);

  useEffect(() => {
    if (nextCursor && hasMorePosts) {
      axios(`${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/search`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => {
          // console.log(response);
          setPosts((prevPosts) => [...prevPosts, ...response.data.data.posts]);
          setUserName(response.data.data.posts.name);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [accessToken, hasMorePosts]);

  const handlePostSuccess = (postContent) => {
    setUserName(postContent.name);
  };

  return (
    <UserProvider>
    <div className={styles.container}>
    <Navbar userName={userName}/>
      <div className={styles.HomePagelayout}>
        <div className={styles.friendSidebar}>
          <FriendSider />
        </div>
        <div className={styles.HomePagePost}>
          <SaySomething userPhoto={myPhoto} onPostSuccess={handlePostSuccess}/>
          {posts.map((post) => (
            <PostDetailPage key={post.id} post={post} shouldHideData={false} userPhoto={myPhoto}/>
          ))}
          <Footer />
        </div>
      </div>
    </div>
    </UserProvider>
  );
}

export default HomePage;
