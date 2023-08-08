/* eslint-disable @next/next/no-img-element */

"use client"

import { useState } from 'react';
import axios from "axios";
import { parseCookies }  from 'nookies';
import styles from "./styles/saysomething.module.scss";

function SaySomething({ userPhoto }){
  const [postContent, setPostContent] = useState("");
  const cookies = parseCookies();
  const accessToken = cookies.accessToken || '';

  const handlePostSubmit = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts`,
        { context: postContent },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        window.location.reload();
      } else {
        console.log("Failed to publish the post.");
      }
      } catch (error) {
      console.log("Error occurred while publishing the post:", error);
      }
  };
  return (
    <div className={styles.SaySomethingplace}>
      <img className={styles.myPhoto} src={userPhoto} alt="Logo" />
      <textarea
        className={styles.sayPlace} 
        placeholder="說點什麼嗎？"
        rows={5}
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
      />
      <button 
        className={styles.AddFeedText}
        type="button"
        onClick={handlePostSubmit}>
        發布貼文
      </button>
    </div>
  );
};

export default SaySomething;
