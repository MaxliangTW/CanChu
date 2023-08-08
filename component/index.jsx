"use client"

import React, { useState } from 'react';
import "normalize.css";
import { UserProvider } from './UsersContext';
import Navbar from "./navbar";
import styles from "./styles/styles.module.scss";
import PostDetailPage from "./postDetailPage";

function IndexPage () {
  const [posts, setPosts] = useState([]);
  return (
    <UserProvider>
    <div className={styles.container}>
      <Navbar />
      {posts.map((post) => (
            <PostDetailPage key={post.id} post={post} shouldHideData={false} userPhoto={myPhoto}/>
          ))}
    </div>
    </UserProvider>
  );
};
export default IndexPage;
