import { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { parseCookies } from 'nookies';

const Scroll = () => {
  const [posts, setPosts] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [pageLoaded, setPageLoaded] = useState(false); 
  const { user_id: userId, accessToken } = parseCookies();
  const isPageLoadedRef = useRef(false);

  const fetchPosts = async (cursor = null) => {
    let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/search`;
    if (cursor) {
      url = `${url}?cursor=${cursor}`;
    } else if (userId) {
      url = `${url}?user_id=${userId}`;
    }

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { posts: newPosts, next_cursor } = response.data.data;
      console.log(next_cursor); 
      setNextCursor(next_cursor);
      if (cursor) {
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      } else {
        setPosts(newPosts);
      }
      if (!next_cursor) {
        setHasMorePosts(false);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    isPageLoadedRef.current = true;
  }, []);

  useEffect(() => {
    if (isPageLoadedRef.current) { 
      const handleScroll = () => {
        const distanceFromBottom = document.documentElement.offsetHeight - (window.scrollY + window.innerHeight);
        if (distanceFromBottom <= 100 && !isLoading && hasMorePosts && nextCursor) {
          console.log("get the posts!");
          setIsLoading(true);
          fetchPosts(nextCursor);
        }
      };
  
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [nextCursor, isLoading, hasMorePosts]);


  return [posts, setPosts, nextCursor];
};


export default Scroll;