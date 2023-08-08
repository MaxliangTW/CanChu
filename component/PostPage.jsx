"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from "./navbar";
import PostDetailPage from "./postDetailPage";

const PostPage = ({ postData }) => (
    <div>
      <Navbar />
      {postData ? (
        postData.map((post) => (
          <PostDetailPage key={post.id} post={post} shouldHideData={false} />
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );

export default PostPage;

export async function getStaticPaths() {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/posts`);
      const {posts} = response.data.data;

      console.log('Posts:', posts);
      
      const paths = posts.map((post) => ({
        params: { posts_id: post.id.toString() },
      }));
      
      return { paths, fallback: false };
    } catch (error) {
      console.log(error);
      return { paths: [], fallback: false };
    }
  }
export async function getStaticProps({ params }) {
    const postId = params.posts_id;

    console.log('Post ID:', postId);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${postId}`);
      const postData = response.data.data;

      console.log('Post Data:', postData);
      return {
        props: {
          postData,
        },
      };
    } catch (error) {
      console.log(error);
      return {
        props: {
          postData: null,
        },
      };
    }
  }