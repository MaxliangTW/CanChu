/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable camelcase */

"use client"

import React, { useState } from 'react';
import Link from "next/link";
import axios from "axios";
import { parseCookies } from 'nookies';
import styles from "./styles/postDetailPage.module.scss";


function Comment({ comment , userName , userPhoto}) {
  return (
    <div className={styles.commentfeature}>
      <img
        className={styles.commentUserImage}
        src={userPhoto}
        alt="User Image"
      />
      <div className={styles.commentContent}>
        <div className={styles.commentContentPlace}>
          <div className={styles.commentUserName}>{userName}</div>
          <div className={styles.commentText}>{comment.content}</div>
        </div>
        <div className={styles.commentTime}>{comment.created_at}</div>
      </div>
    </div>
  );
}
const PostDetailPage = ({ post, shouldHideData, userPhoto }) => {
  const [isLiked, setIsLiked] = useState(post.is_liked || false);
  const [likeCount, setLikeCount] = useState(post.like_count || 0);
  const [heartImage, setHeartImage] = useState("/image/Nullheart.png");
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [comment_count, setCommentCount] = useState(post.comment_count || 0);
  const {
    context,
    name,
    created_at,
  } = post;
  const contextLines = context ? context.split("\n"):[];

  const cookies = parseCookies();
  const accessToken = cookies.accessToken || '';
  const likePost = async  () => {
    setLikeCount(likeCount + 1);
    try{
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${post.id}/like`,
        {},
        {
          headers:{
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if(response.status === 200){
        setLikeCount(response.data.post.id);
      }else{
        console.log("Failed to post the post");
      }
    }catch(error){
      console.log("Error",error);
    }
  };

  const unlikePost = async  () => {
    setLikeCount(likeCount - 1);
    try{
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${post.id}/like`,
        {
          headers:{
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if(response.status === 200){
        setLikeCount(response.data.post.id);
      }else{
        console.log("Failed to delete the post");
      }
    }catch(error){
      console.log("Error",error);
    }
  };

  const handleLikeSubmit = async() => {
    console.log("isliked",isLiked);
    if(!isLiked){
      likePost();
      setIsLiked(true);
    }else{
      unlikePost();
      setIsLiked(false);
    }
  };

  const handleSubmitComment = async () => {
    try {
      if (!commentText.trim()) {
        return;
      }
  
      setCommentCount((prevCount) => prevCount + 1);
      
      const currentTime = new Date().toISOString();
      
      const commentData = {
        content: commentText,
        created_at: currentTime,
      };

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${post.id}/comment`,
        commentData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json', 
          },
        }
      );
  
      setComments((prevComments) => [
        ...prevComments,
        commentData,
      ]);
      
      setCommentText('');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div key={post.id} className={styles.post}>
      <div className={styles.postHeader}>
        <img
          className={styles.peoplePicture}
          src={userPhoto}
          alt="User Picture"
        />
        <div className={styles.postInformation}>
          <p className={styles.userName}>{name}</p>
          {shouldHideData ? (
            <Link href="/post/[postId]" as={`/post/${post.id}`}>
              <p className={styles.releaseTime}>{created_at}</p>
            </Link>
          ) : (
            <p className={styles.releaseTime}>{created_at}</p>
          )}
        </div>
      </div>
      <div className={styles.postContent}>
        <p className={styles.content}>
          {context ? contextLines.map((line, index) => (
            <p key={index}>{line}</p>
          )) : "此貼文沒有內容" }
        </p>
      </div>
      <div className={styles.postFeatures}>
      <img
          className={`${styles.feature1} ${isLiked ? styles.active : ''}`}
          src={isLiked ? "/image/heart-2.png" : "/image/Nullheart.png"}
          alt="Feature 1"
          onClick={handleLikeSubmit}
        />
        {shouldHideData ? (
          <Link href="/post/[postId]" as={`/post/${post.id}`}>
            <img
              className={styles.feature2}
              src="/image/Fb-comment.png"
              alt="Feature 2"
            />
          </Link>
        ) : (
          <img
            className={styles.feature2}
            src="/image/Fb-comment.png"
            alt="Feature 2"
          />
        )}
      </div>
      <div className={styles.reach}>
        <p>{likeCount}位喜歡這則貼文</p>
        {shouldHideData ? (
          <Link href="/post/[postId]" as={`/post/${post.id}`}>
            <p>{comment_count}則留言</p>
          </Link>
        ) : (
          <p>{comment_count}則留言</p>
        )}
      </div>
      {shouldHideData ? (
        <Link href="/post/[postId]" as={`/post/${post.id}`}>
          <div className={styles.myComment}>
            <div className={styles.commentContainer}>
              <img
                className={styles.profilePhoto}
                src={userPhoto}
                alt="Profile Photo"
              />
              <button className={styles.comment}>
                <p className={styles.commentText}>留個言吧</p>
              </button>
            </div>
          </div>
        </Link>
      ) : (
        <div className={styles.myComment}>
          <div className={styles.comments}>
          {comments &&
              comments.map((comment) => (
                <Comment key={comment.id} comment={comment} userName={name} userPhoto={userPhoto} created_at={created_at} />
              ))}
          </div>
          <div className={styles.commentContainer}>
            <img className={styles.profilePhoto} src={userPhoto} />
            <input
              className={styles.comment}
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="留個言吧"
            />
            <button className={styles.arrow} onClick={handleSubmitComment}>
              <img src="/image/abd566ec2cf50d153162f350157d291c 1.png" />
            </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default PostDetailPage;

