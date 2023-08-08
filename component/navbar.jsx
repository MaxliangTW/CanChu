/* eslint-disable @next/next/no-img-element */

"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { parseCookies,destroyCookie } from 'nookies';
import Link from "next/link";
import Image from "next/legacy/image";
import styles from "./styles/postDetailPage.module.scss";

function handleLogout() {
  destroyCookie(null, 'accessToken', {
    path: '/',
  });
    window.location.href = '/login';
}

function Navbar({ userName }){
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const cookies = parseCookies();
  const accessToken = cookies.accessToken || '';
  // const userName = cookies.userName || '';

  useEffect(() => {
    if (keyword.trim() !== "") {
      fetchSearchResults();
    }
  }, [keyword]);

  const fetchSearchResults = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/search?keyword=${keyword}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setSearchResults(response.data.data.users);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleSearchFocus = () => {
    setShowResults(true);
    setShowUserList(true);
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setShowResults(false);
      setShowUserList(false);
    }, 100);
  };

  const handleDropdownClick = () => {
    setShowDropdown(!showDropdown);
  };

  return(  
    <div className={styles.Nav}>
      <Link href="/">
        <img className={styles.logoPhoto} src="/image/CanChu.png" alt="Logo" />
      </Link>
      <div className={styles.searchPlace}>
        <img
          className={styles.searchPhoto}
          src="/image/search.png"
          alt="search"
        />
        <input
          type="text"
          className={styles.searchText}
          value={keyword}
          placeholder="搜尋"
          onChange={(e) => {
            setKeyword(e.target.value);
            fetchSearchResults();
          }}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
        />
      </div>
      {showUserList && searchResults?.length > 0 && (
            <ul className={styles.userList}>
              {searchResults?.map((user) => (
                <li key={user.id} className={styles.userListItem}>
                  <Image
                    src={user.picture}
                    alt={`${user.name}'s picture`}
                    height={36}
                    width={36}
                  />
                  <Link href="/users/[userId]" as={`/users/${user.id}`} className={styles.userName}>
                    {user.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
      <div className={styles.dropdownContainer}>
          <img 
            className={styles.LogoutLink} 
            src="/image/下載.png" 
            alt="myName"
            onClick={handleDropdownClick}
          />
        {showDropdown && (
          <div className={styles.dropdownMenu}>
            <div className={styles.myNameimg}>
              <span>{userName}</span>
            </div>
            <div className={styles.personalpageLink}>
              <Link href="/personalpage">
                <div>查看個人頁面</div>
              </Link>
            </div>
            <div className={styles.logout} onClick={handleLogout}>
              <b>登出</b>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
export default Navbar;

